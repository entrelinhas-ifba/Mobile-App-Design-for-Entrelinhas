import { useEffect, useState } from "react";

// Backend response shape (adjust if the API changes)
export type Historico = {
  id: string;
  tipo: "SIMPLES" | "PROFUNDA";
  data: string; // ISO timestamp
  resumo: string; // short description shown in the list
  // optional thumbnail image for the analysis (e.g., a cropped photo)
  imagem?: string;
};

type Filter = "TODOS" | "SIMPLES" | "PROFUNDA";

/**
 * HistoryList – UI for displaying the user's analysis history.
 *
 * Features:
 *   • Filter bar (Todos / Simples / Profunda)
 *   • Loading skeleton (Tailwind `animate-pulse`)
 *   • Empty‑state illustration
 *   • Card‑style items with optional thumbnail, type badge and timestamp
 *   • Responsive grid (mobile‑first)
 */
export function HistoryList({ onItemClick }: { onItemClick: (id: string) => void }) {
  // ---------- State ----------
  const [historicos, setHistoricos] = useState<Historico[]>([]);
  const [filter, setFilter] = useState<Filter>("TODOS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- Data fetch ----------
  useEffect(() => {
    fetch("/api/historicos")
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Historico[]) => {
        setHistoricos(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // ---------- Filter ----------
  const filtered = historicos.filter((h) => {
    if (filter === "TODOS") return true;
    return h.tipo === filter;
  });

  // ---------- UI ----------
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">Erro ao carregar o histórico: {error}</div>;
  }

  return (
    <div className="p-4">
      {/* Filter bar */}
      <div className="flex gap-2 mb-4">
        {(["TODOS", "SIMPLES", "PROFUNDA"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter === f
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            {f === "TODOS" ? "Todos" : f === "SIMPLES" ? "Simples" : "Profunda"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <svg className="mx-auto mb-4 w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-9 4h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((h) => (
            <button
              key={h.id}
              onClick={() => onItemClick(h.id)}
              className="w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              {/* Thumbnail (if provided) */}
              {h.imagem && (
                <img
                  src={h.imagem}
                  alt="miniatura"
                  className="w-12 h-12 mr-3 rounded object-cover shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-gray-800 truncate">{h.resumo}</div>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      h.tipo === "SIMPLES" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {h.tipo === "SIMPLES" ? "Simples" : "Profunda"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {new Date(h.data).toLocaleDateString()}{" "}
                  {new Date(h.data).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
