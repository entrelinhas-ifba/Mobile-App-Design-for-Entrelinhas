import { useState, useCallback } from "react";
import type { AnalysisResult, AnalysisPayload, AnalysisMode } from "@/types/analysis.types";
import { analysisService } from "../services/analysisService";
import { defaultAnalysisResult } from "@/services/api/mockData";

export interface UseAnalysisReturn {
  analysis: AnalysisResult;
  isLoading: boolean;
  error: string | null;
  isBackendOffline: boolean;
  executeAnalysis: (payload: AnalysisPayload) => Promise<void>;
  executeImageAnalysis: (image: File | Blob | string, mode?: AnalysisMode) => Promise<void>;
  executeCorrection: (text: string) => Promise<string | null>;
  executeCleaning: (text: string) => Promise<string | null>;
  reset: () => void;
}

export function useAnalysis(initialData: AnalysisResult = defaultAnalysisResult): UseAnalysisReturn {
  const [analysis, setAnalysis] = useState<AnalysisResult>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOffline, setIsBackendOffline] = useState<boolean>(false);

  const executeImageAnalysis = useCallback(
    async (image: File | Blob | string, mode: AnalysisMode = "rapida") => {
      setIsLoading(true);
      setError(null);
      setIsBackendOffline(false);

      try {
        const data = await analysisService.analyzeImage(image, mode);
        setAnalysis(data);
      } catch (err: unknown) {
        console.warn("Backend offline ou erro de conexão:", err);
        setIsBackendOffline(true);
        // Fallback demonstrativo elegante para não travar a UI
        setAnalysis({
          ...defaultAnalysisResult,
          id: `analysis-${Date.now()}`,
          chapter: mode === "rapida" ? "Leitura Rápida" : "Análise Aprofundada",
        });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

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

  const executeCorrection = useCallback(async (text: string): Promise<string | null> => {
    try {
      return await analysisService.correctText(text);
    } catch (e) {
      console.warn("Falha ao corrigir texto via backend:", e);
      return null;
    }
  }, []);

  const executeCleaning = useCallback(async (text: string): Promise<string | null> => {
    try {
      return await analysisService.cleanText(text);
    } catch (e) {
      console.warn("Falha ao limpar texto via backend:", e);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(defaultAnalysisResult);
    setError(null);
    setIsLoading(false);
    setIsBackendOffline(false);
  }, []);

  return {
    analysis,
    isLoading,
    error,
    isBackendOffline,
    executeAnalysis,
    executeImageAnalysis,
    executeCorrection,
    executeCleaning,
    reset,
  };
}
