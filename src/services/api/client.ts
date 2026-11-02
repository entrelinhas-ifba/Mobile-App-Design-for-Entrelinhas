export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

const BASE_URL = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || "";

export async function apiClient<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { params, headers, ...customConfig } = config;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    url += `?${query}`;
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("@entrelinhas:token") || sessionStorage.getItem("@entrelinhas:token")
      : null;
  const requestHeaders = new Headers(headers);

  // If body is NOT FormData, default to application/json
  if (!(customConfig.body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    requestHeaders.set("Authorization", `Bearer ${cleanToken}`);
  }

  try {
    let response: Response;
    try {
      response = await fetch(url, {
        ...customConfig,
        headers: requestHeaders,
      });
    } catch (networkError) {
      // If relative URL failed and BASE_URL was empty, attempt direct localhost:8002 connection
      if (!BASE_URL && url.startsWith("/")) {
        const directUrl = `http://localhost:8002${url}`;
        response = await fetch(directUrl, {
          ...customConfig,
          headers: requestHeaders,
        });
      } else {
        throw networkError;
      }
    }

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("unauthorized"));
      }
      const errorText = await response.text().catch(() => "");
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.erro) errorMessage = errorJson.erro;
        else if (errorJson.mensagem) errorMessage = errorJson.mensagem;
        else if (errorJson.message) errorMessage = errorJson.message;
        else if (errorJson.error) errorMessage = errorJson.error;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      throw new AppError(errorMessage, response.status);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }
    return (await response.text()) as unknown as T;
  } catch (error) {
    if (error instanceof AppError) throw error;
    const msg = error instanceof Error ? error.message : "Falha na conexão com o servidor da API (porta 8002)";
    throw new AppError(msg, 500, error);
  }
}
