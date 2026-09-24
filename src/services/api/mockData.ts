import type { Snippet, AnalysisResult } from "@/types/analysis.types";
import type { HistoryItem } from "@/types/history.types";

export const recentSnippets: Snippet[] = [
  {
    id: 1,
    author: "Machado de Assis",
    title: "Memórias Póstumas de Brás Cubas",
    intent: "Ironia / Melancolia",
    date: "02 Set",
    words: 312,
    color: "#FEF3E8",
    accent: "#D97736",
    bg: "#FEF3E8",
  },
  {
    id: 2,
    author: "Clarice Lispector",
    title: "A Paixão Segundo G.H.",
    intent: "Introspecção Existencial",
    date: "30 Ago",
    words: 228,
    color: "#EFF6FF",
    accent: "#1D4ED8",
    bg: "#EFF6FF",
  },
  {
    id: 3,
    author: "Fernando Pessoa",
    title: "Livro do Desassossego",
    intent: "Melancolia / Despersonalização",
    date: "28 Ago",
    words: 405,
    color: "#ECFDF5",
    accent: "#059669",
    bg: "#ECFDF5",
  },
];

export const historyItems: HistoryItem[] = [
  {
    id: 1,
    author: "Machado de Assis",
    title: "Memórias Póstumas de Brás Cubas",
    chapter: "Cap. IX — O Delírio",
    intent: "Ironia / Melancolia",
    date: "02 Set 2026",
    words: 312,
    accent: "#D97736",
    bg: "#FEF3E8",
    translated: false,
  },
  {
    id: 2,
    author: "Clarice Lispector",
    title: "A Paixão Segundo G.H.",
    chapter: "Parte III",
    intent: "Introspecção Existencial",
    date: "30 Ago 2026",
    words: 228,
    accent: "#1D4ED8",
    bg: "#EFF6FF",
    translated: true,
  },
  {
    id: 3,
    author: "Fernando Pessoa",
    title: "Livro do Desassossego",
    chapter: "Fragmento 47",
    intent: "Melancolia / Despersonalização",
    date: "28 Ago 2026",
    words: 405,
    accent: "#059669",
    bg: "#ECFDF5",
    translated: false,
  },
  {
    id: 4,
    author: "José Saramago",
    title: "Ensaio sobre a Cegueira",
    chapter: "Cap. II",
    intent: "Crítica Social / Alegoria",
    date: "25 Ago 2026",
    words: 519,
    accent: "#D97736",
    bg: "#FEF3E8",
    translated: true,
  },
  {
    id: 5,
    author: "Guimarães Rosa",
    title: "Grande Sertão: Veredas",
    chapter: "Incipit",
    intent: "Transcendência / Dualidade",
    date: "20 Ago 2026",
    words: 287,
    accent: "#1D4ED8",
    bg: "#EFF6FF",
    translated: false,
  },
];

export const dailyQuote = {
  quote: "O tempo é o maior professor, mas infelizmente mata todos os seus alunos.",
  author: "Hector Berlioz",
};

export const defaultAnalysisResult: AnalysisResult = {
  id: "bras-cubas-cap-9",
  author: "Machado de Assis",
  bookTitle: "Memórias Póstumas de Brás Cubas",
  chapter: "Cap. IX — O Delírio",
  confidenceScore: 94,
  extractedText: `"Ao vencedor, as batatas." Estava assim redigido o papel que o Bento Francisco de Paula Melo — ou simplesmente Bento, como toda a gente o chamava — deixara sobre a mesa, antes de partir para o outro mundo. Não havia mais nada, nem uma palavra de explicação ou de despedida. Somente aquelas quatro palavras...`,
  wordCount: 312,
  charCount: 1847,
  ocrAccuracy: "98.4%",
  intents: ["Ironia Machadiana", "Crítica Social Implícita", "Melancolia Velada"],
  summaryPoints: [
    "O narrador póstumo usa humor negro para satirizar a hipocrisia e as convenções da sociedade do século XIX.",
    "A célebre frase \"Ao vencedor, as batatas\" sintetiza a alegoria do darwinismo social e a crueldade da ambição humana.",
    "O distanciamento irônico estabelece um pacto direto com o leitor, inaugurando a modernidade da prosa machadiana.",
  ],
  toneMetrics: [
    { label: "Tom narrativo", value: "Irônico-melancólico", pct: 94 },
    { label: "Narrador", value: "Não-confiável (póstumo)", pct: 88 },
    { label: "Subtexto filosófico", value: "Crítica ao positivismo", pct: 79 },
  ],
  contextualNotes: [
    {
      title: "Período Histórico",
      sub: "Brasil Imperial, 1881",
      content:
        "Publicado durante o Segundo Reinado, o romance antecipa a desilusão com o Império ao dissecar a aristocracia escravocrata carioca sob um olhar impiedosamente lúcido.",
    },
    {
      title: "Movimento Literário",
      sub: "Realismo Brasileiro",
      content:
        "Rompe com o Romantismo ao adotar um defunto autor como protagonista, técnica de digressão permanente e ceticismo filosófico.",
    },
    {
      title: "Figuras de Linguagem",
      sub: "3 identificadas",
      content:
        "Ironia estrutural dominante, antítese (glória x esquecimento) e alegoria cáustica na imagem das batatas.",
    },
  ],
  translation: {
    text: `"To the winner, the potatoes." — a sardonic 19th-century Brazilian proverb expressing philosophical cynicism: spoils inevitably go to the victor, regardless of moral merit.`,
    idiomNote: "Expressão idiomática que alude à posse e disputa por recursos vitais na sátira de Humanitas.",
  },
};
