interface DeepAnalysisHubProps {
  onScan: () => void;
}

export function DeepAnalysisHub({ onScan }: DeepAnalysisHubProps) {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="mb-6">
        <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#1F2421]">Análise Aprofundada</h2>
        <p className="text-[13px] text-[#9CA3AF] mt-1">
          Detecção semântica completa, contexto histórico, figuras de linguagem e tradução
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Call to action */}
        <div className="md:col-span-6">
          <button
            onClick={onScan}
            className="w-full bg-white rounded-2xl border-2 border-dashed border-[#D97736]/40 hover:border-[#D97736] p-8 flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-all text-center group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#FEF3E8] group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
            <div>
              <p className="font-serif text-[18px] font-semibold text-[#1F2421]">Iniciar Análise Profunda</p>
              <p className="text-[12px] text-[#9CA3AF] mt-1">Processamento interpretativo completo · ~45 seg</p>
            </div>
            <div className="mt-2 px-4 py-2 rounded-xl bg-[#D97736] text-white text-[13px] font-semibold">
              Capturar para Estudo
            </div>
          </button>
        </div>

        {/* Included Resources */}
        <div className="md:col-span-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">
              Recursos Avançados Incluídos
            </p>
            {[
              {
                icon: "🎯",
                label: "Tema central e intenção autoral",
                desc: "Mapeamento semântico do propósito e tom do autor no trecho",
              },
              {
                icon: "📜",
                label: "Contexto e referências históricas",
                desc: "Identificação de acontecimentos, períodos, personagens e relações contextuais",
              },
              {
                icon: "🌿",
                label: "Figuras de linguagem contextualizadas",
                desc: "Detecção do tipo, indicação do trecho e explicação do significado",
              },
              {
                icon: "🌐",
                label: "Detecção de idioma e tradução para português",
                desc: "Tradução integral de obras estrangeiras preservando o estilo original",
              },
              {
                icon: "🔍",
                label: "Análise crítica geral e construção textual",
                desc: "Avaliação profunda de linguagem, ideias, estrutura e possíveis significados",
              },
            ].map((f) => (
              <div key={f.label} className="py-2.5 border-b border-[#F0EFE9] last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-[16px]">{f.icon}</span>
                  <span className="text-[13px] font-semibold text-[#2B2F2D]">{f.label}</span>
                </div>
                <p className="text-[11px] text-[#6B7280] ml-7 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
