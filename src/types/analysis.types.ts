export type AnalysisMode = "rapida" | "aprofundada" | "simples" | "profunda";

export type ResultTab = "digitalizado" | "interpretacao";

export interface ToneMetric {
  label: string;
  value: string;
  pct: number;
}

export interface ContextualNote {
  title: string;
  sub: string;
  content: string;
}

export interface Snippet {
  id: number;
  author: string;
  title: string;
  intent: string;
  date: string;
  words: number;
  color: string;
  accent: string;
  bg: string;
}

export interface AnalysisResult {
  id: string;
  author: string;
  bookTitle: string;
  chapter: string;
  confidenceScore: number;
  extractedText: string;
  wordCount: number;
  charCount: number;
  ocrAccuracy?: string;
  intents: string[];
  summaryPoints: string[];
  toneMetrics: ToneMetric[];
  contextualNotes: ContextualNote[];
  translation?: {
    text: string;
    idiomNote: string;
  };
  // Campos da Análise Profunda (/api/analysis/profunda)
  idiomaOriginal?: string;
  traducao?: string;
  contextoHistorico?: string;
  referenciasHistoricas?: string[];
  figurasDeLinguagem?: string[];
  analiseGeral?: string;
}

/**
 * Resposta da Análise Simples do backend (/api/analysis)
 */
export interface InterpretationResponseDTO {
  resumo?: string;
  tema?: string;
  intencaoAutor?: string;
  ideiasPrincipais?: string[];
  textoOriginal?: string;
  texto?: string;
}

/**
 * Resposta da Análise Profunda do backend (/api/analysis/profunda)
 */
export interface DeepInterpretationResponseDTO {
  idiomaOriginal?: string;
  traducao?: string;
  resumo?: string;
  temaPrincipal?: string;
  intencaoAutor?: string;
  ideiasPrincipais?: string[];
  contextoHistorico?: string;
  referenciasHistoricas?: string[];
  figurasDeLinguagem?: string[];
  analiseGeral?: string;
  textoOriginal?: string;
}

export interface AnalysisPayload {
  rawText: string;
  mode: AnalysisMode;
}
