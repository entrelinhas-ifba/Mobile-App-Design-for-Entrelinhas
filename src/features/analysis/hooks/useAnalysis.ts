import { useState, useCallback } from "react";
import type { AnalysisResult, AnalysisPayload } from "@/types/analysis.types";
import { analysisService } from "../services/analysisService";
import { defaultAnalysisResult } from "@/services/api/mockData";

export interface UseAnalysisReturn {
  analysis: AnalysisResult;
  isLoading: boolean;
  error: string | null;
  executeAnalysis: (payload: AnalysisPayload) => Promise<void>;
  reset: () => void;
}

export function useAnalysis(initialData: AnalysisResult = defaultAnalysisResult): UseAnalysisReturn {
  const [analysis, setAnalysis] = useState<AnalysisResult>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const executeAnalysis = useCallback(async (payload: AnalysisPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await analysisService.analyzeText(payload);
      setAnalysis(data);
    } catch {
      setError("Falha ao analisar o trecho literário. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(defaultAnalysisResult);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    analysis,
    isLoading,
    error,
    executeAnalysis,
    reset,
  };
}
