import type { AnalysisResult, AnalysisPayload } from "@/types/analysis.types";
import { defaultAnalysisResult } from "@/services/api/mockData";

export const analysisService = {
  analyzeText: async (payload: AnalysisPayload): Promise<AnalysisResult> => {
    // Simula processamento assíncrono com latência realista
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      ...defaultAnalysisResult,
      id: `analysis-${Date.now()}`,
      extractedText: payload.rawText || defaultAnalysisResult.extractedText,
    };
  },

  getAnalysisById: async (_id: string): Promise<AnalysisResult> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return defaultAnalysisResult;
  },
};
