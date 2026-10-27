import { apiClient } from "@/services/api/client";

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  expiraEm: number;
}

export interface RegisterResponse {
  mensagem: string;
}

export const authService = {
  /**
   * Registra um novo usuário no backend EntreLinhas (localhost:8002/auth/register)
   * Payload: { nome, email, senha }
   */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    return apiClient<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nome: payload.nome.trim(),
        email: payload.email.trim().toLowerCase(),
        senha: payload.senha,
      }),
    });
  },

  /**
   * Realiza login no backend EntreLinhas (localhost:8002/auth/login)
   * Payload: { email, senha }
   * Retorna: { token, tipo: "Bearer", expiraEm: 86400000 }
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    return apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        senha: payload.senha,
      }),
    });
  },
};
