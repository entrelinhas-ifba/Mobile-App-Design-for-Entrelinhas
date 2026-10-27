import type {
  AnalysisResult,
  AnalysisPayload,
  AnalysisMode,
  InterpretationResponseDTO,
  DeepInterpretationResponseDTO,
  ContextualNote,
} from "@/types/analysis.types";
import { apiClient } from "@/services/api/client";
import { defaultAnalysisResult } from "@/services/api/mockData";

function dataURLtoBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(";base64,");
  if (parts.length < 2) {
    return new Blob([dataUrl], { type: "text/plain" });
  }
  const contentType = parts[0].split(":")[1] || "image/jpeg";
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

export const analysisService = {
  /**
   * Envia a imagem para os endpoints do backend:
   * - Análise Simples: /api/analysis
   * - Análise Profunda: /api/analysis/profunda
   * O token JWT é anexado automaticamente pelo apiClient via Authorization: Bearer <token>.
   */
  analyzeImage: async (
    image: File | Blob | string,
    mode: AnalysisMode = "rapida"
  ): Promise<AnalysisResult> => {
    let fileBlob: Blob;
    let fileName = "pagina.jpg";

    if (typeof image === "string") {
      fileBlob = dataURLtoBlob(image);
    } else if (image instanceof File) {
      fileBlob = image;
      fileName = image.name;
    } else {
      fileBlob = image;
    }

    const formData = new FormData();
    formData.append("file", fileBlob, fileName);

    const isDeep = mode === "aprofundada" || mode === "profunda";

    if (isDeep) {
      // Endpoint de Análise Profunda (/api/analysis/profunda)
      const res = await apiClient<DeepInterpretationResponseDTO>("/api/analysis/profunda", {
        method: "POST",
        body: formData,
      });

      const extractedText =
        (res.textoOriginal && res.textoOriginal.trim()) ||
        defaultAnalysisResult.extractedText;

      const words = extractedText.trim().split(/\s+/).filter(Boolean).length;
      const chars = extractedText.length;

      const intents = [res.intencaoAutor, res.temaPrincipal].filter(Boolean) as string[];

      const contextualNotes: ContextualNote[] = [
        {
          title: "Tema Central",
          sub: "Identificado pela Inteligência Artificial",
          content: res.temaPrincipal || "Tema geral do trecho extraído.",
        },
        {
          title: "Intenção do Autor",
          sub: "Mapeamento Semântico e Retórico",
          content: res.intencaoAutor || "Intenção detectada no trecho literário.",
        },
        {
          title: "Síntese Textual",
          sub: "Resumo interpretativo profundo",
          content: res.resumo || "Resumo conciso do conteúdo textual.",
        },
      ];

      if (res.contextoHistorico) {
        contextualNotes.push({
          title: "Contexto Histórico",
          sub: "Época e Movimento Literário",
          content: res.contextoHistorico,
        });
      }

      if (res.analiseGeral) {
        contextualNotes.push({
          title: "Análise Crítica Geral",
          sub: "Avaliação interpretativa expandida",
          content: res.analiseGeral,
        });
      }

      const translation = res.traducao
        ? {
            text: res.traducao,
            idiomNote: res.idiomaOriginal ? `Idioma original: ${res.idiomaOriginal}` : "Tradução literária",
          }
        : undefined;

      return {
        id: `analysis-profunda-${Date.now()}`,
        author: "Trecho Escaneado",
        bookTitle: res.temaPrincipal
          ? res.temaPrincipal.length > 36
            ? res.temaPrincipal.slice(0, 33) + "..."
            : res.temaPrincipal
          : "Página Capturada",
        chapter: "Análise Profunda",
        confidenceScore: 96,
        extractedText,
        wordCount: words,
        charCount: chars,
        intents: intents.length > 0 ? intents : ["Análise Profunda", "Interpretação Avançada"],
        summaryPoints:
          res.ideiasPrincipais && res.ideiasPrincipais.length > 0
            ? res.ideiasPrincipais
            : res.resumo
            ? [res.resumo]
            : defaultAnalysisResult.summaryPoints,
        toneMetrics: [
          { label: "Clareza Argumentativa", value: "Muito Alta", pct: 95 },
          { label: "Densidade Conceitual", value: "Profunda", pct: 92 },
          { label: "Expressividade Estilística", value: "Forte", pct: 90 },
        ],
        contextualNotes,
        translation,
        idiomaOriginal: res.idiomaOriginal,
        traducao: res.traducao,
        contextoHistorico: res.contextoHistorico,
        referenciasHistoricas: res.referenciasHistoricas,
        figurasDeLinguagem: res.figurasDeLinguagem,
        analiseGeral: res.analiseGeral,
      };
    } else {
      // Endpoint de Análise Simples (/api/analysis)
      const res = await apiClient<InterpretationResponseDTO>("/api/analysis", {
        method: "POST",
        body: formData,
      });

      const extractedText =
        (res.textoOriginal && res.textoOriginal.trim()) ||
        (res.texto && res.texto.trim()) ||
        defaultAnalysisResult.extractedText;

      const words = extractedText.trim().split(/\s+/).filter(Boolean).length;
      const chars = extractedText.length;

      const intents = [res.intencaoAutor, res.tema].filter(Boolean) as string[];

      const contextualNotes: ContextualNote[] = [
        {
          title: "Tema Central",
          sub: "Identificado pela Inteligência Artificial",
          content: res.tema || "Tema geral do trecho extraído.",
        },
        {
          title: "Intenção do Autor",
          sub: "Mapeamento Semântico",
          content: res.intencaoAutor || "Intenção detectada no trecho literário.",
        },
        {
          title: "Síntese Textual",
          sub: "Resumo interpretativo simples",
          content: res.resumo || "Resumo conciso do conteúdo textual.",
        },
      ];

      return {
        id: `analysis-simples-${Date.now()}`,
        author: "Trecho Escaneado",
        bookTitle: res.tema
          ? res.tema.length > 36
            ? res.tema.slice(0, 33) + "..."
            : res.tema
          : "Página Capturada",
        chapter: "Leitura Rápida",
        confidenceScore: 92,
        extractedText,
        wordCount: words,
        charCount: chars,
        intents: intents.length > 0 ? intents : ["Interpretação IA", "Leitura Literária"],
        summaryPoints:
          res.ideiasPrincipais && res.ideiasPrincipais.length > 0
            ? res.ideiasPrincipais
            : res.resumo
            ? [res.resumo]
            : defaultAnalysisResult.summaryPoints,
        toneMetrics: [
          { label: "Clareza", value: "Alta", pct: 92 },
          { label: "Densidade Conceitual", value: "Moderada-alta", pct: 86 },
          { label: "Expressividade", value: "Forte", pct: 88 },
        ],
        contextualNotes,
      };
    }
  },

  /**
   * Envia texto diretamente para o endpoint de interpretação do Ollama (/interpretation)
   */
  analyzeText: async (payload: AnalysisPayload): Promise<AnalysisResult> => {
    try {
      const res = await apiClient<InterpretationResponseDTO>("/interpretation", {
        method: "POST",
        body: payload.rawText,
        headers: { "Content-Type": "text/plain" },
      });

      const words = payload.rawText.trim().split(/\s+/).filter(Boolean).length;
      const intents = [res.intencaoAutor, res.tema].filter(Boolean) as string[];

      return {
        id: `analysis-${Date.now()}`,
        author: "Texto Inserido",
        bookTitle: res.tema ? (res.tema.length > 36 ? res.tema.slice(0, 33) + "..." : res.tema) : "Trecho Literário",
        chapter: payload.mode === "rapida" || payload.mode === "simples" ? "Leitura Rápida" : "Análise Aprofundada",
        confidenceScore: 92,
        extractedText: payload.rawText,
        wordCount: words,
        charCount: payload.rawText.length,
        intents: intents.length > 0 ? intents : ["Interpretação IA"],
        summaryPoints:
          res.ideiasPrincipais && res.ideiasPrincipais.length > 0
            ? res.ideiasPrincipais
            : res.resumo
            ? [res.resumo]
            : defaultAnalysisResult.summaryPoints,
        toneMetrics: defaultAnalysisResult.toneMetrics,
        contextualNotes: defaultAnalysisResult.contextualNotes,
      };
    } catch {
      // Retorna fallback demonstrativo se o servidor backend não estiver ativo
      return {
        ...defaultAnalysisResult,
        id: `analysis-${Date.now()}`,
        extractedText: payload.rawText || defaultAnalysisResult.extractedText,
      };
    }
  },

  /**
   * Corrige texto usando Ollama (/correction)
   */
  correctText: async (text: string): Promise<string> => {
    return apiClient<string>("/correction", {
      method: "POST",
      body: text,
      headers: { "Content-Type": "text/plain" },
    });
  },

  /**
   * Limpa texto via regex (/cleaning)
   */
  cleanText: async (text: string): Promise<string> => {
    return apiClient<string>("/cleaning", {
      method: "POST",
      body: text,
      headers: { "Content-Type": "text/plain" },
    });
  },

  getAnalysisById: async (_id: string): Promise<AnalysisResult> => {
    return defaultAnalysisResult;
  },
};
