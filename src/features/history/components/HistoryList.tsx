import type { HistoryFilter } from "@/types/history.types";
import { useHistory } from "../hooks/useHistory";

interface HistoryListProps {
  onItemClick: () => void;
}

export function HistoryList({ onItemClick }: HistoryListProps) {
  const {
    filter,
    setFilter,
    search,
    setSearch,
    favorited,
    toggleFavorite,
    filteredItems,
  } = useHistory();

  const filters: { key: HistoryFilter; label: string }[] = [
    { key: "todas", label: "Todas as Obras" },
    { key: "autor", label: "Por Autor" },
    { key: "intencao", label: "Por Intenção" },
    { key: "traduzidos", label: "Traduzidos" },
  ];

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Header & Search */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#1F2421]">
              Histórico de Leituras
            </h2>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">
              Acervo de trechos literários escaneados e interpretados
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="2" />
              <path d="M16.5 16.5L21 21" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar autor, obra, tema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-[13px] text-[#1F2421] placeholder-[#9CA3AF] outline-none focus:border-[#1D4ED8] transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 text-[12px] font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                filter === f.key
                  ? "bg-[#1D4ED8] text-white shadow-sm font-semibold"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F3F2EE]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-[12px] text-[#9CA3AF] mb-4 font-medium">
        {filteredItems.length} {filteredItems.length === 1 ? "obra catalogada" : "obras catalogadas"}
      </p>

      {/* Responsive Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={onItemClick}
            className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#BFDBFE] hover:shadow-md shadow-sm overflow-hidden text-left cursor-pointer transition-all flex group"
          >
            {/* Book Spine Accent */}
            <div className="w-2 flex-shrink-0" style={{ background: item.accent }} />

            {/* Simulated mini book page */}
            <div
              className="w-[72px] flex-shrink-0 flex items-center justify-center p-2.5"
              style={{ background: item.bg }}
            >
              <div className="flex flex-col gap-1.5 w-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[3px] rounded-full"
                    style={{ background: item.accent + "50", width: `${55 + Math.sin(i * 1.5) * 35}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1 p-3.5 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#1F2421] truncate group-hover:text-[#1D4ED8] transition-colors">
                      {item.author}
                    </p>
                    <p className="text-[12px] text-[#6B7280] truncate mt-0.5">{item.title}</p>
                    <p className="text-[10px] text-[#9CA3AF] truncate mt-0.5">{item.chapter}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="flex-shrink-0 p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        stroke={favorited.includes(item.id) ? "#D97736" : "#D1D5DB"}
                        strokeWidth="1.8"
                        fill={favorited.includes(item.id) ? "#D97736" : "none"}
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: item.bg, color: item.accent }}
                  >
                    {item.intent}
                  </span>
                  {item.translated && (
                    <span className="text-[10px] text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-full font-medium">
                      PT⇄EN
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#9CA3AF] mt-2 pt-2 border-t border-[#F0EFE9]">
                  <span>{item.date}</span>
                  <span>{item.words} palavras</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
