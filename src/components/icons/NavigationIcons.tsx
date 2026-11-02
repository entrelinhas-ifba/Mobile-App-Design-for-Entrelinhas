export const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"
      stroke={active ? "#1D4ED8" : "#9CA3AF"}
      strokeWidth="1.8"
      fill={active ? "#EFF6FF" : "none"}
    />
    <path d="M9 21V12h6v9" stroke={active ? "#1D4ED8" : "#9CA3AF"} strokeWidth="1.8" />
  </svg>
);

export const ZapIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <polygon
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      stroke={active ? "#D97736" : "#9CA3AF"}
      strokeWidth="1.8"
      fill={active ? "#FEF3E8" : "none"}
    />
  </svg>
);

export const SearchIcon2 = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke={active ? "#1D4ED8" : "#9CA3AF"} strokeWidth="1.8" />
    <path d="M16.5 16.5L21 21" stroke={active ? "#1D4ED8" : "#9CA3AF"} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 11h6M11 8v6" stroke={active ? "#1D4ED8" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BookIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 19.5A2.5 2.5 0 016.5 17H20"
      stroke={active ? "#059669" : "#9CA3AF"}
      strokeWidth="1.8"
    />
    <path
      d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
      stroke={active ? "#059669" : "#9CA3AF"}
      strokeWidth="1.8"
      fill={active ? "#ECFDF5" : "none"}
    />
    <path d="M9 7h6M9 11h4" stroke={active ? "#059669" : "#9CA3AF"} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
