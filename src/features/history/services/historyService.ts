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

export interface BackendHistoryDTO {
  id: number;
  tipoAnalise: "SIMPLES" | "PROFUNDA";
  textoOriginal: string;
  idiomaOriginal?: string;
  criadoEm: string;
  resultado: string;
}

export interface HistoryStats {
  paginasEsteMes: number;
  palavrasAnalisadas: number;
}

export interface RecentSnippetItem {
  id: number | string;
  author: string;
  title: string;
  intent: string;
  date: string;
  words: number;
  color: string;
  accent: string;
  bg: string;
}

/**
 * Converte o objeto retornado pelo backend (HistoryItem) para o formato
 * usado na UI (`Historico`).
 */
function toHistorico(item: HistoryItem) {
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

  const MAX_LEN = 120;
  let shortResumo = resumo;
  if (shortResumo.length > MAX_LEN) {
    shortResumo = shortResumo.slice(0, MAX_LEN - 3) + "...";
  }

  const displayResumo = firstIdea ? `${shortResumo} – ${firstIdea}` : shortResumo;

  return {
    id: String(item.id),
    tipo: (item as any).tipoAnalise ?? "SIMPLES",
    data: (item as any).criadoEm ?? "",
    resumo: displayResumo,
    imagem: (item as any).imagem ?? undefined,
  } as const;
}

function parseSnippetFromBackend(item: BackendHistoryDTO, index: number): RecentSnippetItem {
  let parsed: {
    resumo?: string;
    tema?: string;
    temaPrincipal?: string;
    intencaoAutor?: string;
    ideiasPrincipais?: string[];
  } = {};

  try {
    parsed = JSON.parse(item.resultado || "{}");
  } catch {
    // fallback
  }

  const themes = [
    { bg: "#FEF3E8", color: "#FEF3E8", accent: "#D97736" },
    { bg: "#EFF6FF", color: "#EFF6FF", accent: "#1D4ED8" },
    { bg: "#ECFDF5", color: "#ECFDF5", accent: "#059669" },
    { bg: "#FAF5FF", color: "#FAF5FF", accent: "#7C3AED" },
  ];
  const theme = themes[index % themes.length];

  const words = item.textoOriginal
    ? item.textoOriginal.trim().split(/\s+/).filter(Boolean).length
    : parsed.resumo
    ? parsed.resumo.trim().split(/\s+/).filter(Boolean).length
    : 0;

  let formattedDate = "";
  if (item.criadoEm) {
    try {
      const d = new Date(item.criadoEm);
      formattedDate = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
    } catch {
      formattedDate = "Recente";
    }
  }

  const titleTheme = parsed.tema || parsed.temaPrincipal || "Análise Literária";
  const quoteExcerpt = parsed.resumo
    ? parsed.resumo.length > 55
      ? parsed.resumo.slice(0, 52) + "..."
      : parsed.resumo
    : item.textoOriginal
    ? item.textoOriginal.length > 55
      ? item.textoOriginal.slice(0, 52) + "..."
      : item.textoOriginal
    : titleTheme;

  return {
    id: item.id,
    author: item.idiomaOriginal ? `Texto (${item.idiomaOriginal})` : "Trecho Escaneado",
    title: quoteExcerpt,
    intent: parsed.intencaoAutor || (item.tipoAnalise === "PROFUNDA" ? "Análise Profunda" : "Análise Rápida"),
    date: formattedDate || "Recente",
    words,
    color: theme.color,
    accent: theme.accent,
    bg: theme.bg,
  };
}

export const historyService = {
  /**
   * Busca o histórico do usuário autenticado formatado para HistoryList.
   */
  getHistoryItems: async (): Promise<ReturnType<typeof toHistorico>[]> => {
    const items = await apiClient<HistoryItem[]>("/api/historicos", {
      method: "GET",
    });
    return items.map(toHistorico);
  },

  /**
   * Retorna os últimos trechos do histórico formatados para os cards da HomeScreen.
   */
  getRecentSnippets: async (limit = 3): Promise<RecentSnippetItem[]> => {
    try {
      const items = await apiClient<BackendHistoryDTO[]>("/api/historicos", {
        method: "GET",
      });
      return items.slice(0, limit).map((item, idx) => parseSnippetFromBackend(item, idx));
    } catch {
      return [];
    }
  },

  /**
   * Retorna as análises rápidas recentes (tipo SIMPLES) para a QuickAnalysisHub.
   */
  getRecentQuickSnippets: async (limit = 3): Promise<RecentSnippetItem[]> => {
    try {
      const items = await apiClient<BackendHistoryDTO[]>("/api/historicos?tipo=SIMPLES", {
        method: "GET",
      });
      const simples = items.filter((i) => i.tipoAnalise === "SIMPLES");
      const list = simples.length > 0 ? simples : items;
      return list.slice(0, limit).map((item, idx) => parseSnippetFromBackend(item, idx));
    } catch {
      return [];
    }
  },

  /**
   * Retorna as métricas de leitura (Páginas este mês e Palavras analisadas).
   * Tenta primeiro o endpoint /api/historicos/estatisticas do backend.
   * Se indisponível, faz o cálculo a partir da listagem geral de históricos.
   */
  getStats: async (): Promise<HistoryStats> => {
    try {
      return await apiClient<HistoryStats>("/api/historicos/estatisticas", {
        method: "GET",
      });
    } catch {
      try {
        const items = await apiClient<BackendHistoryDTO[]>("/api/historicos", {
          method: "GET",
        });
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let paginasEsteMes = 0;
        let palavrasAnalisadas = 0;

        for (const item of items) {
          const words = item.textoOriginal
            ? item.textoOriginal.trim().split(/\s+/).filter(Boolean).length
            : 0;
          palavrasAnalisadas += words;

          if (item.criadoEm) {
            const itemDate = new Date(item.criadoEm);
            if (itemDate >= startOfMonth) {
              paginasEsteMes++;
            }
          }
        }
        return { paginasEsteMes, palavrasAnalisadas };
      } catch {
        return { paginasEsteMes: 0, palavrasAnalisadas: 0 };
      }
    }
  },

  /**
   * Retorna a contagem total de itens salvos no histórico.
   */
  getTotalCount: async (): Promise<number> => {
    try {
      const items = await apiClient<BackendHistoryDTO[]>("/api/historicos", {
        method: "GET",
      });
      return items.length;
    } catch {
      return 0;
    }
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
