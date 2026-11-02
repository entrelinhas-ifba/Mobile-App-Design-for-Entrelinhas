import type { HistoryItem } from "@/types/history.types";
import { apiClient } from "@/services/api/client";

/**
 * DTO enviado ao backend ao salvar um histórico.
 */
export interface HistoryRequestDTO {
  /** Tipo de análise: "SIMPLES" ou "PROFUNDA" */
  tipoAnalise: "SIMPLES" | "PROFUNDA";
  /** Texto original analisado */
  textoOriginal: string;
  /** Idioma original opcional */
  idiomaOriginal?: string;
  /** Resultado da análise em JSON (string) */
  resultado: string;
}

/**
 * Converte o objeto retornado pelo backend (HistoryItem) para o formato
 * usado na UI (`Historico`). Ajuste os campos conforme o contrato da API.
 */
function toHistorico(item: HistoryItem) {
  // Parse the JSON result to extract resumo and first main idea
  let resumo = "";
  let firstIdea = "";
  try {
    const parsed = JSON.parse((item as any).resultado || "{}") as {
      resumo?: string;
      ideiasPrincipais?: string[];
    };
    resumo = parsed.resumo ?? "";
    if (parsed.ideiasPrincipais && parsed.ideiasPrincipais.length > 0) {
      firstIdea = parsed.ideiasPrincipais[0];
    }
  } catch {
    // ignore parse errors
  }

  // Truncate resumo to avoid overflow (max 120 chars)
  const MAX_LEN = 120;
  let shortResumo = resumo;
  if (shortResumo.length > MAX_LEN) {
    shortResumo = shortResumo.slice(0, MAX_LEN - 3) + "...";
  }

  // Combine with first idea if present
  const displayResumo = firstIdea ? `${shortResumo} – ${firstIdea}` : shortResumo;

  return {
    id: String(item.id),
    // field that indicates the analysis type is `tipoAnalise`
    tipo: (item as any).tipoAnalise ?? "SIMPLES",
    // timestamp comes from `criadoEm`
    data: (item as any).criadoEm ?? "",
    resumo: displayResumo,
    // optional thumbnail (not present yet)
    imagem: (item as any).imagem ?? undefined,
  } as const;
}

export const historyService = {
  /**
   * Busca o histórico do usuário autenticado.
   * Não aceita filtro (o UI filtra localmente).
   */
  getHistoryItems: async (): Promise<ReturnType<typeof toHistorico>[]> => {
    const items = await apiClient<HistoryItem[]>("/api/historicos", {
      method: "GET",
    });
    // converte cada registro para o formato usado na UI
    return items.map(toHistorico);
  },

  /**
   * Persiste um novo registro no backend.
   */
  saveHistory: async (payload: HistoryRequestDTO): Promise<void> => {
    await apiClient<null>("/api/historicos", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

