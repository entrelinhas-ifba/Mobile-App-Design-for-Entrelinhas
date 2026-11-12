import { useState, useRef, useEffect } from "react";
import type { NavTab } from "@/types/navigation.types";
import {
  HomeIcon,
  ZapIcon,
  SearchIcon2,
  BookIcon,
} from "@/components/icons/NavigationIcons";
import { useAuth } from "@/features/auth";

interface AppHeaderProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onOpenLogin?: () => void;
}

export function AppHeader({ activeTab, onChangeTab, onOpenLogin }: AppHeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navTabs: { key: NavTab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
    { key: "home", label: "Início", Icon: HomeIcon },
    { key: "rapida", label: "Análise Rápida", Icon: ZapIcon },
    { key: "aprofundada", label: "Profunda", Icon: SearchIcon2 },
    { key: "historico", label: "Histórico", Icon: BookIcon },
  ];

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#F0EFE9] px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 sm:h-18">
        {/* Brand with New Uploaded Logo */}
        <button
          onClick={() => onChangeTab("home")}
          className="flex items-center gap-3.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white p-1 border border-blue-100 shadow-sm ring-2 ring-blue-50/80 flex items-center justify-center overflow-hidden group-hover:ring-blue-200 group-hover:scale-105 transition-all">
            <img
              src="/logo.jpg"
              alt="Logo EntreLinhas"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-[21px] sm:text-[23px] font-bold text-[#1F2421] tracking-tight leading-none group-hover:text-[#1D4ED8] transition-colors">
                EntreLinhas
              </h1>
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium leading-tight mt-1 hidden xs:block">
              Mais que palavras, significados.
            </p>
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
                    ? "bg-white text-[#1F2421] shadow-xs font-semibold"
                    : "text-[#6B7280] hover:text-[#1F2421] hover:bg-white/50"
                }`}
              >
                <Icon active={isActive} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools & User Section */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex text-[11px] font-medium text-[#1D4ED8] bg-[#EFF6FF] px-3 py-1.5 rounded-full border border-[#BFDBFE] hover:bg-blue-100 transition-colors tracking-wide cursor-pointer">
            PT ⇄ EN
          </button>

          {/* User Auth Info / Profile Button */}
          {isAuthenticated && user && user.provider !== "guest" ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-200 transition-all cursor-pointer focus:outline-none"
                aria-label="Menu do Usuário"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#1D4ED8] to-[#7C3AED] flex items-center justify-center shadow-xs">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] font-bold text-white">
                      {getInitials(user.name)}
                    </span>
                  )}
                  {user.provider === "google" && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs p-0.5">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>

              {/* Profile Dropdown Popover */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-[#1F2421]">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-blue-800">
                          {getInitials(user.name)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        {user.provider === "google" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                            Conta Google
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            Conta EntreLinhas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (onOpenLogin) onOpenLogin();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Alternar Conta
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                        if (onOpenLogin) onOpenLogin();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair da Conta
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenLogin) onOpenLogin();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] px-3.5 py-1.5 rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
