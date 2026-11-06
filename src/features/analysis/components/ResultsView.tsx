import { useState, useEffect } from "react";
import type { AnalysisMode, ResultTab } from "@/types/analysis.types";
import { useAnalysis } from "../hooks/useAnalysis";

interface ResultsViewProps {
  mode: AnalysisMode;
  onBack: () => void;
  imageSrc?: string | null;
}

export function ResultsView({ mode, onBack, imageSrc }: ResultsViewProps) {
  const {
    analysis,
    isLoading,
    isBackendOffline,
    executeImageAnalysis,
    executeCorrection,
    executeCleaning,
  } = useAnalysis();

  const [tab, setTab] = useState<ResultTab>("digitalizado");
  const [viewMode, setViewMode] = useState<"texto" | "imagem">("texto");
  const [expandedSection, setExpandedSection] = useState<string | null>("Período Histórico");
  const [showTranslation, setShowTranslation] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edição de texto e ações de IA
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(analysis.extractedText);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  // Executa a análise real pelo backend quando uma imagem for fornecida
  useEffect(() => {
    if (imageSrc) {
      executeImageAnalysis(imageSrc, mode);
    }
  }, [imageSrc, mode, executeImageAnalysis]);

  useEffect(() => {
    setCurrentText(analysis.extractedText);
  }, [analysis.extractedText]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCorrectText = async () => {
    setIsProcessingAction(true);
    setActionStatus("Corrigindo ortografia e sintaxe com Ollama...");
    const corrected = await executeCorrection(currentText);
    if (corrected && corrected.trim()) {
      setCurrentText(corrected);
      setActionStatus("Texto corrigido pela IA!");
    } else {
      setActionStatus("Não foi possível conectar ao Ollama (porta 11434).");
    }
    setIsProcessingAction(false);
    setTimeout(() => setActionStatus(null), 3500);
  };

  const handleCleanText = async () => {
    setIsProcessingAction(true);
    setActionStatus("Limpando ruídos e formatação...");
    const cleaned = await executeCleaning(currentText);
    if (cleaned && cleaned.trim()) {
      setCurrentText(cleaned);
      setActionStatus("Ruídos removidos com sucesso!");
    } else {
      setActionStatus("Serviço de limpeza indisponível.");
    }
    setIsProcessingAction(false);
    setTimeout(() => setActionStatus(null), 3500);
  };

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

      {/* Backend Status Notice */}
      {isBackendOffline && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-[12px] text-amber-800">
          <span className="text-[15px] leading-none mt-0.5">ℹ️</span>
          <div className="flex-1">
            <span className="font-semibold">Modo de Demonstração Ativo:</span> O servidor Spring Boot local (porta 8002) não respondeu no momento. Exibindo análise demonstrativa.
            <div className="text-[11px] text-amber-700/90 mt-0.5">
              Para processamento em tempo real com Tesseract e Ollama, execute: <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">cd api && mvn spring-boot:run</code>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay State */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 sm:p-16 flex flex-col items-center justify-center gap-4 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center animate-pulse">
            <span className="text-2xl animate-spin">⚙️</span>
          </div>
          <div>
            <h3 className="font-serif text-[18px] font-semibold text-[#1F2421]">
              Processando via API EntreLinhas
            </h3>
            <p className="text-[13px] text-[#6B7280] mt-1 max-w-md">
              Extraindo texto da página, limpando ruídos e interpretando intenções e tema com Inteligência Artificial...
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#9CA3AF]">
            <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-ping" />
            <span>Spring Boot · Tesseract · Llama 3</span>
          </div>
        </div>
      ) : (
        <>
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
                      {viewMode === "texto" ? "Texto Extraído" : "Imagem Original"}
                    </p>
                    {imageSrc && (
                      <div className="flex bg-[#F3F2EE] p-0.5 rounded-lg text-[10px]">
                        <button
                          onClick={() => setViewMode("texto")}
                          className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                            viewMode === "texto" ? "bg-white text-[#1F2421] shadow-xs font-semibold" : "text-[#6B7280]"
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
                      onClick={handleCopy}
                      className="text-[11px] text-[#1D4ED8] font-medium px-2.5 py-1 bg-[#EFF6FF] rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      {copied ? "✓ Copiado" : "Copiar"}
                    </button>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                        isEditing
                          ? "bg-[#1D4ED8] text-white"
                          : "text-[#6B7280] bg-[#F3F2EE] hover:bg-neutral-200"
                      }`}
                    >
                      {isEditing ? "Concluir" : "Editar"}
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
                  ) : isEditing ? (
                    <div className="flex flex-col gap-3">
                      <textarea
                        value={currentText}
                        onChange={(e) => setCurrentText(e.target.value)}
                        rows={8}
                        className="w-full font-serif text-[15px] sm:text-[16px] leading-[1.85] text-[#1F2421] bg-white p-4 rounded-xl border border-[#BFDBFE] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 resize-y"
                        placeholder="Edite o texto extraído..."
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={handleCorrectText}
                          disabled={isProcessingAction}
                          className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-blue-100 text-[#1D4ED8] text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <span>✨</span> Corrigir com IA (/correction)
                        </button>
                        <button
                          onClick={handleCleanText}
                          disabled={isProcessingAction}
                          className="px-3 py-1.5 rounded-lg bg-[#F3F2EE] hover:bg-neutral-200 text-[#2B2F2D] text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <span>🧹</span> Limpar Ruídos (/cleaning)
                        </button>
                      </div>
                      {actionStatus && (
                        <p className="text-[11px] text-[#1D4ED8] font-medium animate-fade-in">
                          {actionStatus}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="font-serif text-[15px] sm:text-[16px] leading-[1.85] text-[#1F2421] italic bg-[#FBF9F5] p-4 sm:p-5 rounded-xl border border-[#F0EFE9]">
                      {currentText}
                    </p>
                  )}
                </div>
              </div>

              {/* Word Count Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Palavras", value: String(currentText.trim().split(/\s+/).filter(Boolean).length) },
                  { label: "Caracteres", value: currentText.length.toLocaleString("pt-BR") },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-[#E5E7EB] p-3 text-center shadow-sm">
                    <p className="text-[18px] font-bold text-[#1D4ED8]">{s.value}</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Auto-saved status indicator */}
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#ECFDF5] border border-[#A7F3D0]/70 rounded-xl text-[12px] font-medium text-[#059669] shadow-xs">
                <span className="text-[14px]">✓</span>
                <span>Análise salva automaticamente no Histórico</span>
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
                  Resumo Literário & Ideias Principais
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

              {/* Figuras de Linguagem (Análise Profunda) */}
              {analysis.figurasDeLinguagem && analysis.figurasDeLinguagem.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">🎭</span>
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                      Figuras de Linguagem Detectadas
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.figurasDeLinguagem.map((fig, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-[12px] font-medium bg-purple-50 text-purple-700 border border-purple-200/80"
                      >
                        {fig}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Referências Históricas (Análise Profunda) */}
              {analysis.referenciasHistoricas && analysis.referenciasHistoricas.length > 0 && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">🏛️</span>
                    <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-widest">
                      Referências & Alusões Históricas
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {analysis.referenciasHistoricas.map((ref, idx) => (
                      <li key={idx} className="text-[13px] text-[#374151] flex items-start gap-2">
                        <span className="text-[#1D4ED8] mt-1 font-bold">•</span>
                        <span>{ref}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
        </>
      )}
    </div>
  );
}
