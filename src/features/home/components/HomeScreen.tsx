import { useRef, useState } from "react";
import type { AnalysisMode } from "@/types/analysis.types";
import { recentSnippets, historyItems } from "@/services/api/mockData";
import { useAuth } from "@/features/auth";

interface HomeScreenProps {
  mode: AnalysisMode;
  setMode: (m: AnalysisMode) => void;
  onCapture: () => void;
  onSelectImage?: (imageSrc: string) => void;
  onSnippetClick: () => void;
  onViewAllHistory: () => void;
}

export function HomeScreen({
  mode,
  setMode,
  onCapture,
  onSelectImage,
  onSnippetClick,
  onViewAllHistory,
}: HomeScreenProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string" && onSelectImage) {
        onSelectImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Brand Greeting Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center p-1 flex-shrink-0 shadow-xs">
            <img src="/logo.jpg" alt="EntreLinhas" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1F2421]">
              {user && user.provider !== "guest" ? `Olá, ${user.name.split(" ")[0]}!` : "Bem-vindo ao EntreLinhas"}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Mais que palavras, significados. Analise e interprete textos literários com inteligência contextual.
            </p>
          </div>
        </div>
      </div>

      {/* Responsive 2-Column Grid on Tablet/Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Mode Selector & Capture Zone */}
        <div className="md:col-span-5 flex flex-col gap-5">
          {/* Mode Selector */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="flex p-1 gap-1 bg-[#F3F2EE] m-3.5 rounded-xl">
              <button
                onClick={() => setMode("rapida")}
                className={`flex-1 py-2.5 px-3 rounded-lg text-[12px] font-medium transition-all duration-200 cursor-pointer ${
                  mode === "rapida"
                    ? "bg-white shadow-sm text-[#1F2421] font-semibold"
                    : "text-[#6B7280] hover:text-[#1F2421]"
                }`}
              >
                ⚡ Análise Rápida
              </button>
              <button
                onClick={() => setMode("aprofundada")}
                className={`flex-1 py-2.5 px-3 rounded-lg text-[12px] font-medium transition-all duration-200 cursor-pointer ${
                  mode === "aprofundada"
                    ? "bg-white shadow-sm text-[#1F2421] font-semibold"
                    : "text-[#6B7280] hover:text-[#1F2421]"
                }`}
              >
                🔍 Aprofundada
              </button>
            </div>
            <div className="px-4 pb-4">
              {mode === "rapida" ? (
                <div>
                  <p className="text-[13px] font-semibold text-[#1F2421]">Análise Rápida</p>
                  <p className="text-[12px] text-[#6B7280] mt-1 leading-relaxed">
                    Leitura direta, tema central, intenção preliminar e resumo conciso em segundos.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-[13px] font-semibold text-[#1F2421]">Análise Aprofundada</p>
                  <p className="text-[12px] text-[#6B7280] mt-1 leading-relaxed">
                    Detecção semântica completa, notas históricas, figuras de linguagem e tradução anotada.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Capture Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-3 mb-4 transition-all cursor-pointer ${
                isDragging
                  ? "border-[#1D4ED8] bg-[#EFF6FF] scale-[1.01]"
                  : "border-[#BFDBFE] hover:border-[#1D4ED8] bg-[#FBFBFA]"
              }`}
              onClick={onCapture}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center shadow-sm">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#1D4ED8" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="#1D4ED8" strokeWidth="1.8" />
                  <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" stroke="#1D4ED8" strokeWidth="1.4" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-serif text-[16px] font-semibold text-[#1F2421]">Capturar Página de Livro</p>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">Posicione o livro sob boa iluminação ou arraste uma foto</p>
              </div>
            </div>
            <button
              onClick={onCapture}
              className="w-full py-3.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-[14px] font-semibold tracking-wide flex items-center justify-center gap-2 active:opacity-90 transition-all shadow-md shadow-blue-200 cursor-pointer"
            >
              <span>📷</span> Fotografar Página
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-2.5 py-3 rounded-xl border border-[#E5E7EB] hover:bg-[#F3F2EE] text-[#2B2F2D] text-[13px] font-medium flex items-center justify-center gap-2 active:opacity-70 transition-colors cursor-pointer"
            >
              <span>🖼️</span> Escolher da Galeria
            </button>
          </div>
        </div>

        {/* Right Column: Recentes & Destaques Literários */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Recent Snippets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-serif text-[18px] font-semibold text-[#1F2421]">Trechos Recentes</h2>
                <p className="text-[11px] text-[#9CA3AF]">Últimas leituras e análises processadas</p>
              </div>
              <button
                onClick={onViewAllHistory}
                className="text-[12px] text-[#1D4ED8] hover:underline font-medium cursor-pointer"
              >
                Ver todos ({historyItems.length})
              </button>
            </div>

            {/* Responsive Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {recentSnippets.map((s) => (
                <button
                  key={s.id}
                  onClick={onSnippetClick}
                  className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#BFDBFE] hover:shadow-md transition-all shadow-sm overflow-hidden text-left active:scale-[0.98] flex flex-col cursor-pointer"
                >
                  <div
                    className="h-[80px] w-full flex items-center justify-center p-3"
                    style={{ background: s.bg || "#F3F2EE" }}
                  >
                    <div className="font-serif italic text-[11px] text-center leading-relaxed text-[#6B7280] line-clamp-3">
                      "…{s.title}…"
                    </div>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[12px] font-semibold text-[#1F2421] truncate">{s.author}</p>
                      <p className="text-[11px] text-[#6B7280] truncate mt-0.5">{s.title}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ background: s.color, color: s.accent }}
                      >
                        {s.intent}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">{s.words} palavras</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Extra reading insights card for desktop */}
          <div className="hidden sm:grid grid-cols-2 gap-3 bg-white rounded-2xl border border-[#E5E7EB] p-4">
            <div className="text-center p-2 border-r border-[#F0EFE9]">
              <p className="text-[18px] font-bold text-[#1D4ED8]">14</p>
              <p className="text-[11px] text-[#6B7280]">Páginas este mês</p>
            </div>
            <div className="text-center p-2">
              <p className="text-[18px] font-bold text-[#D97736]">3</p>
              <p className="text-[11px] text-[#6B7280]">Autores explorados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
