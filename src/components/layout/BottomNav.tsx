import type { NavTab } from "@/types/navigation.types";
import {
  HomeIcon,
  ZapIcon,
  SearchIcon2,
  BookIcon,
} from "@/components/icons/NavigationIcons";

interface BottomNavProps {
  active: NavTab;
  onChange: (t: NavTab) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const tabs: { key: NavTab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
    { key: "home", label: "Início", Icon: HomeIcon },
    { key: "rapida", label: "Rápida", Icon: ZapIcon },
    { key: "aprofundada", label: "Profunda", Icon: SearchIcon2 },
    { key: "historico", label: "Histórico", Icon: BookIcon },
  ];

  return (
    <nav
      aria-label="Navegação Mobile"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden flex items-center border-t border-[#E5E7EB] bg-white/95 backdrop-blur-md px-2 py-1 shadow-lg"
    >
      {tabs.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="flex-1 flex flex-col items-center py-2 gap-1 active:opacity-70 transition-opacity cursor-pointer"
        >
          <Icon active={active === key} />
          <span
            className={`text-[10px] font-medium transition-colors ${
              active === key
                ? key === "rapida"
                  ? "text-[#D97736] font-semibold"
                  : key === "historico"
                  ? "text-[#059669] font-semibold"
                  : "text-[#1D4ED8] font-semibold"
                : "text-[#9CA3AF]"
            }`}
          >
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
