import { useState, useMemo } from "react";
import type { HistoryFilter } from "@/types/history.types";
import { historyItems } from "@/services/api/mockData";

export function useHistory() {
  const [filter, setFilter] = useState<HistoryFilter>("todas");
  const [search, setSearch] = useState("");
  const [favorited, setFavorited] = useState<number[]>([1]);

  const toggleFavorite = (id: number) => {
    setFavorited((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredItems = useMemo(() => {
    return historyItems.filter((item) => {
      if (filter === "traduzidos" && !item.translated) return false;
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        item.author.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.intent.toLowerCase().includes(q)
      );
    });
  }, [filter, search]);

  return {
    filter,
    setFilter,
    search,
    setSearch,
    favorited,
    toggleFavorite,
    filteredItems,
  };
}
