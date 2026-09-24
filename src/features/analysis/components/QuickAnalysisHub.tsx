import { recentSnippets } from "@/services/api/mockData";

interface QuickAnalysisHubProps {
  onScan: () => void;
}

export function QuickAnalysisHub({ onScan }: QuickAnalysisHubProps) {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="mb-6">
        <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#1F2421]">Análise Rápida</h2>
        <p className="text-[13px] text-[#9CA3AF] mt-1">OCR imediato, intenção e síntese preliminar em segundos</p>
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
          <p className="font-serif text-[16px] font-semibold text-[#1F2421]">Análises Rápidas Recentes</p>
          {recentSnippets.slice(0, 2).map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] font-semibold text-[#1F2421]">{s.author}</p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: s.color, color: s.accent }}>
                  ⚡ Rápida
                </span>
              </div>
              <p className="text-[12px] text-[#6B7280]">{s.title}</p>
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#F0EFE9] text-[11px] text-[#9CA3AF]">
                <span>{s.date}</span>
                <span>•</span>
                <span style={{ color: s.accent }} className="font-medium">{s.intent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
