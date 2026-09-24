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

  const token = typeof window !== "undefined" ? localStorage.getItem("@entrelinhas:token") : null;
  const requestHeaders = new Headers(headers);

  // If body is NOT FormData, default to application/json
  if (!(customConfig.body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...customConfig,
      headers: requestHeaders,
    });

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("unauthorized"));
      }
      const errorText = await response.text().catch(() => "");
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) errorMessage = errorJson.message;
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
    throw new AppError("Falha na conexão com o servidor da API (porta 8002)", 500, error);
  }
}
