export type Score = number;

export type ScoreData = {
  title: string;
  enabled: boolean;
  score: Score;
  notes: string;
  info: string;
};

export enum ScreenerStockDecision {
  BUY = "BUY",
  WATCH = "WATCH",
  SELL = "SELL",
}

export type ScoreSection = {
  avgGrade: Score;
  overviewNotes: string;
  data: ScoreData[];
};

export type ScreenerStockData = {
  name: string;
  ticker: string;
  totalAvgGrade: Score;
  decision: ScreenerStockDecision | null;
  notes: string;
  valuation: ScoreSection;
  ratios: ScoreSection;
  incomeStatement: ScoreSection;
  balanceSheet: ScoreSection;
  cashFlowStatement: ScoreSection;
};
