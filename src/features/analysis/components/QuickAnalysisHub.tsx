import { useEffect, useState } from "react";
import {
  historyService,
  type RecentSnippetItem,
} from "@/features/history/services/historyService";
import { useAuth } from "@/features/auth";
import { recentSnippets as mockSnippets } from "@/services/api/mockData";

interface QuickAnalysisHubProps {
  onScan: () => void;
  onItemClick?: () => void;
}

export function QuickAnalysisHub({ onScan, onItemClick }: QuickAnalysisHubProps) {
  const { isAuthenticated } = useAuth();
  const [snippets, setSnippets] = useState<RecentSnippetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadQuickSnippets() {
      setIsLoading(true);
      try {
        const data = await historyService.getRecentQuickSnippets(3);
        if (!isMounted) return;

        if (data && data.length > 0) {
          setSnippets(data);
        } else if (!isAuthenticated) {
          // Em modo demonstração/visitante
          setSnippets(mockSnippets.slice(0, 2));
        } else {
          setSnippets([]);
        }
      } catch (err) {
        console.error("Erro ao carregar análises rápidas:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadQuickSnippets();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="mb-6">
        <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#1F2421]">Análise Rápida</h2>
        <p className="text-[13px] text-[#9CA3AF] mt-1">Leitura imediata, intenção e síntese preliminar em segundos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Call to action */}
        <div className="md:col-span-6">
          <button
            onClick={onScan}
            className="w-full bg-white rounded-2xl border-2 border-dashed border-[#1D4ED8]/40 hover:border-[#1D4ED8] p-8 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
            <div>
              <p className="font-serif text-[18px] font-semibold text-[#1F2421]">Iniciar Nova Análise Rápida</p>
              <p className="text-[12px] text-[#9CA3AF] mt-1">Clique para fotografar ou carregar um trecho</p>
            </div>
            <div className="mt-2 px-4 py-2 rounded-xl bg-[#1D4ED8] text-white text-[13px] font-semibold">
              Capturar Agora
            </div>
          </button>
        </div>

        {/* Recent Quick Analysis */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-serif text-[16px] font-semibold text-[#1F2421]">Análises Rápidas Recentes</p>
            {snippets.length > 0 && (
              <span className="text-[11px] text-[#9CA3AF] font-medium">{snippets.length} recente(s)</span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 animate-pulse">
                  <div className="h-4 bg-[#F3F2EE] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[#E5E7EB] rounded w-3/4 mb-3" />
                  <div className="h-2.5 bg-[#F3F2EE] rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : snippets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#BFDBFE] p-6 text-center flex flex-col items-center justify-center gap-2">
              <span className="text-2xl">⚡</span>
              <p className="text-[13px] font-semibold text-[#1F2421]">Nenhuma análise rápida recente</p>
              <p className="text-[11px] text-[#6B7280] max-w-xs leading-relaxed">
                Fotografe uma página usando o botão ao lado para fazer sua primeira análise concisa.
              </p>
            </div>
          ) : (
            snippets.map((s) => (
              <div
                key={s.id}
                onClick={onItemClick}
                className={`bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm transition-all ${
                  onItemClick ? "hover:border-[#BFDBFE] hover:shadow-md cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] font-semibold text-[#1F2421] truncate">{s.author}</p>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ background: s.color, color: s.accent }}
                  >
                    ⚡ Rápida
                  </span>
                </div>
                <p className="text-[12px] text-[#6B7280] line-clamp-2 leading-relaxed">{s.title}</p>
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#F0EFE9] text-[11px] text-[#9CA3AF]">
                  <span>{s.date}</span>
                  <span>•</span>
                  <span style={{ color: s.accent }} className="font-medium truncate">
                    {s.intent}
                  </span>
                  <span>•</span>
                  <span>{s.words} palavras</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
