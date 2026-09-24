import type { NavTab } from "@/types/navigation.types";
import {
  HomeIcon,
  ZapIcon,
  SearchIcon2,
  BookIcon,
} from "@/components/icons/NavigationIcons";

interface AppHeaderProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export function AppHeader({ activeTab, onChangeTab }: AppHeaderProps) {
  const navTabs: { key: NavTab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
    { key: "home", label: "Início", Icon: HomeIcon },
    { key: "rapida", label: "Análise Rápida", Icon: ZapIcon },
    { key: "aprofundada", label: "Profunda", Icon: SearchIcon2 },
    { key: "historico", label: "Histórico", Icon: BookIcon },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#F0EFE9] px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        {/* Brand */}
        <button
          onClick={() => onChangeTab("home")}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1D4ED8] flex items-center justify-center shadow-sm text-white font-serif font-bold text-lg group-hover:bg-[#1E40AF] transition-colors">
            E
          </div>
          <div>
            <h1 className="font-serif text-[20px] font-bold text-[#1F2421] tracking-tight leading-none">
              Entrelinhas
            </h1>
            <div className="inline-flex items-center gap-1 mt-0.5">
              <span className="text-[10px] font-semibold text-[#6B7280] bg-[#F3F2EE] px-2 py-0.5 rounded-full tracking-wide uppercase">
                Leitura & Contexto
              </span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F3F2EE] p-1 rounded-xl">
          {navTabs.map(({ key, label, Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => onChangeTab(key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-[#1F2421] shadow-sm font-semibold"
                    : "text-[#6B7280] hover:text-[#1F2421] hover:bg-white/50"
                }`}
              >
                <Icon active={isActive} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2.5">
          <button className="text-[11px] font-medium text-[#1D4ED8] bg-[#EFF6FF] px-3 py-1.5 rounded-full border border-[#BFDBFE] hover:bg-blue-100 transition-colors tracking-wide cursor-pointer">
            PT ⇄ EN
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] flex items-center justify-center shadow-sm">
            <span className="text-[12px] font-semibold text-white">MA</span>
          </div>
        </div>
      </div>
    </header>
  );
}
