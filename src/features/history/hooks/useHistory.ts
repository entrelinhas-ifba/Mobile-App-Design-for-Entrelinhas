import { useState, useEffect, useMemo } from "react";
import type { HistoryFilter, HistoryItem } from "@/types/history.types";
import { historyService } from "@/features/history/services/historyService";

export function useHistory() {
  const [filter, setFilter] = useState<HistoryFilter>("todas");
  const [search, setSearch] = useState("");
  const [favorited, setFavorited] = useState<number[]>([1]);
  const [items, setItems] = useState<HistoryItem[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorited((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Carrega o histórico do backend sempre que filtro ou busca mudar
  useEffect(() => {
    const load = async () => {
      try {
        const data = await historyService.getHistoryItems(filter, search);
        setItems(data);
      } catch (e) {
        console.error("Erro ao obter histórico:", e);
      }
    };
    load();
  }, [filter, search]);

  // Mantém compatibilidade com a UI que esperava filteredItems
  const filteredItems = useMemo(() => items, [items]);

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
