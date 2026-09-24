export type HistoryFilter = "todas" | "autor" | "intencao" | "traduzidos";

export interface HistoryItem {
  id: number;
  author: string;
  title: string;
  chapter: string;
  intent: string;
  date: string;
  words: number;
  accent: string;
  bg: string;
  translated: boolean;
}
