import { useState } from "react";
import type { AnalysisMode, ResultTab } from "@/types/analysis.types";
import { useAnalysis } from "../hooks/useAnalysis";

interface ResultsViewProps {
  mode: AnalysisMode;
  onBack: () => void;
  imageSrc?: string | null;
}

export function ResultsView({ mode, onBack, imageSrc }: ResultsViewProps) {
  const { analysis } = useAnalysis();
  const [tab, setTab] = useState<ResultTab>("digitalizado");
  const [viewMode, setViewMode] = useState<"ocr" | "imagem">("ocr");
  const [expandedSection, setExpandedSection] = useState<string | null>("Período Histórico");
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#F0EFE9]">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F3F2EE] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#1F2421" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="font-serif text-[18px] sm:text-[20px] font-semibold text-[#1F2421]">
            {analysis.bookTitle}
          </h2>
          <p className="text-[11px] sm:text-[12px] text-[#9CA3AF]">
            {analysis.author} · {analysis.chapter}
          </p>
        </div>
        <div className="px-3 py-1 rounded-full text-[11px] font-semibold text-[#D97736] bg-[#FEF3E8] border border-[#FDBA74]/40">
          {mode === "rapida" ? "⚡ Análise Rápida" : "🔍 Análise Aprofundada"}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden gap-1 p-1 bg-[#F3F2EE] rounded-xl mb-4">
        {(["digitalizado", "interpretacao"] as ResultTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
              tab === t ? "bg-white text-[#1F2421] shadow-sm font-semibold" : "text-[#6B7280]"
            }`}
          >
            {t === "digitalizado" ? "Página Digitalizada" : "Interpretação & Análise"}
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Extracted Text & Stats */}
        <div className={`lg:col-span-6 flex flex-col gap-4 ${tab === "digitalizado" ? "block" : "hidden lg:flex"}`}>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#F0EFE9] bg-[#FBFBFA]">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                  {viewMode === "ocr" ? "Texto Extraído (OCR)" : "Imagem Original"}
                </p>
                {imageSrc && (
                  <div className="flex bg-[#F3F2EE] p-0.5 rounded-lg text-[10px]">
                    <button
                      onClick={() => setViewMode("ocr")}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        viewMode === "ocr" ? "bg-white text-[#1F2421] shadow-xs font-semibold" : "text-[#6B7280]"
                      }`}
                    >
                      Texto
                    </button>
                    <button
                      onClick={() => setViewMode("imagem")}
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        viewMode === "imagem" ? "bg-white text-[#1F2421] shadow-xs font-semibold" : "text-[#6B7280]"
                      }`}
                    >
                      Imagem
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard?.writeText(analysis.extractedText)}
                  className="text-[11px] text-[#1D4ED8] font-medium px-2.5 py-1 bg-[#EFF6FF] rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Copiar
                </button>
                <button className="text-[11px] text-[#6B7280] font-medium px-2.5 py-1 bg-[#F3F2EE] rounded-full hover:bg-neutral-200 transition-colors cursor-pointer">
                  Editar
                </button>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              {viewMode === "imagem" && imageSrc ? (
                <div className="rounded-xl overflow-hidden bg-neutral-900 border border-[#F0EFE9] flex items-center justify-center p-2 max-h-[360px]">
                  <img
                    src={imageSrc}
                    alt="Página selecionada"
                    className="max-h-[340px] w-auto object-contain rounded-lg"
                  />
                </div>
              ) : (
                <p className="font-serif text-[15px] sm:text-[16px] leading-[1.85] text-[#1F2421] italic bg-[#FBF9F5] p-4 sm:p-5 rounded-xl border border-[#F0EFE9]">
                  {analysis.extractedText}
                </p>
              )}
            </div>
          </div>

          {/* Word Count Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Palavras", value: String(analysis.wordCount) },
              { label: "Caracteres", value: analysis.charCount.toLocaleString("pt-BR") },
              { label: "Precisão OCR", value: analysis.ocrAccuracy },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#E5E7EB] p-3 text-center shadow-sm">
                <p className="text-[18px] font-bold text-[#1D4ED8]">{s.value}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            {[
              { icon: "📤", label: "Compartilhar", color: "#1D4ED8" },
              { icon: "📄", label: "Exportar PDF", color: "#059669" },
              { icon: "🔖", label: "Salvar no Histórico", color: "#D97736" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F2EE] text-[13px] font-medium text-[#1F2421] transition-colors shadow-sm cursor-pointer"
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Literary Interpretation & Semantic Insights */}
        <div className={`lg:col-span-6 flex flex-col gap-4 ${tab === "interpretacao" ? "block" : "hidden lg:flex"}`}>
          {/* Intent Detection Badges */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                Intenção & Tonalidade Detectada
              </p>
              <span className="text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full">
                {analysis.confidenceScore}% confiança
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {analysis.intents.map((intent, idx) => (
                <span
                  key={intent}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold border ${
                    idx === 0
                      ? "bg-[#FEF3E8] text-[#D97736] border-[#FDBA74]/40"
                      : idx === 1
                      ? "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]/60"
                      : "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]/60"
                  }`}
                >
                  {intent}
                </span>
              ))}
            </div>

            {/* Confidence Meters */}
            <div className="space-y-2.5 pt-2 border-t border-[#F0EFE9]">
              {analysis.toneMetrics.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-[#6B7280]">{item.label}</span>
                    <span className="font-medium text-[#1F2421]">{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-[#F3F2EE] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1D4ED8] to-[#60A5FA]"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Literary Summary */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-3">
              Resumo Literário em 3 Pontos
            </p>
            <div className="space-y-3">
              {analysis.summaryPoints.map((point, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-[13px] text-[#2B2F2D] leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contextual Footnotes */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest px-5 pt-4 pb-2">
              Notas Contextuais & Paralelos
            </p>
            {analysis.contextualNotes.map((item) => (
              <button
                key={item.title}
                onClick={() => setExpandedSection(expandedSection === item.title ? null : item.title)}
                className="w-full flex items-start justify-between px-5 py-3.5 border-t border-[#F0EFE9] text-left hover:bg-[#FBFBFA] transition-colors cursor-pointer"
              >
                <div className="pr-3">
                  <p className="text-[13px] font-semibold text-[#1F2421]">{item.title}</p>
                  <p className="text-[11px] text-[#9CA3AF]">{item.sub}</p>
                  {expandedSection === item.title && (
                    <p className="text-[12px] text-[#6B7280] mt-2 leading-relaxed">{item.content}</p>
                  )}
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`flex-shrink-0 mt-1 transition-transform duration-200 ${
                    expandedSection === item.title ? "rotate-180" : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            ))}
          </div>

          {/* Translation Toggle Card */}
          {analysis.translation && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[13px] font-semibold text-[#1F2421]">Tradução Literária (PT ⇄ EN)</p>
                  <p className="text-[11px] text-[#9CA3AF]">Preservação de figuras e nuances dialetais</p>
                </div>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${
                    showTranslation ? "bg-[#1D4ED8]" : "bg-[#E5E7EB]"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      showTranslation ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {showTranslation && (
                <div className="bg-[#F3F2EE] rounded-xl p-3.5 mt-2">
                  <p className="font-serif text-[13px] leading-[1.8] text-[#2B2F2D] italic">
                    <span className="bg-[#FEF3E8] text-[#D97736] px-1.5 py-0.5 rounded not-italic text-[11px] font-medium mr-1">
                      idiom
                    </span>
                    {analysis.translation.text}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
