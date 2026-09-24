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

const BASE_URL = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || "/api/v1";

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
  requestHeaders.set("Content-Type", "application/json");
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
      const errorBody = await response.json().catch(() => ({}));
      throw new AppError(
        errorBody.message || `Erro na requisição HTTP: ${response.status}`,
        response.status,
        errorBody
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Falha na conexão com o servidor", 500, error);
  }
}
