import type { HistoryItem, HistoryFilter } from "@/types/history.types";
import { historyItems } from "@/services/api/mockData";

export const historyService = {
  getHistoryItems: async (filter: HistoryFilter = "todas", search: string = ""): Promise<HistoryItem[]> => {
    // Simula requisição assíncrona
    await new Promise((resolve) => setTimeout(resolve, 150));

    return historyItems.filter((item) => {
      if (filter === "traduzidos" && !item.translated) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.author.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.intent.toLowerCase().includes(q)
        );
      }
      return true;
    });
  },
};
