export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export enum ScreenerStockDecision {
  BUY = "BUY",
  WATCH = "WATCH",
  SELL = "SELL",
}

export type ScreenerStockData = {
  name: string;
  ticker: string;
  totalAvgGrade: Grade;
  decision: ScreenerStockDecision | null;
  notes: string;
  valuation: {
    avgGrade: Grade;
    notes: string;
  };
  ratios: {
    avgGrade: Grade;
    notes: string;
  };
  incomeStatement: {
    avgGrade: Grade;
    notes: string;
  };
  balanceSheet: {
    avgGrade: Grade;
    notes: string;
  };
  cashFlowStatement: {
    avgGrade: Grade;
    notes: string;
  };
};
