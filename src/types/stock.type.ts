export type DateTimeString = string;
export type ISODate = string;
export type Ticker = string;

export interface TimeSeriesDailyAdjustedResponse {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": Ticker;
    "3. Last Refreshed": DateTimeString;
    "4. Output Size": string;
    "5. Time Zone": string;
  };
  "Time Series (Daily)": {
    [key: ISODate]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. adjusted close": string;
      "6. volume": string;
      "7. dividend amount": string;
      "8. split coefficient": string;
    };
  };
}

export interface TimeSeriesWeeklyAdjustedResponse {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": Ticker;
    "3. Last Refreshed": DateTimeString;
    "4. Time Zone": string;
  };
  "Weekly Adjusted Time Series": {
    [key: ISODate]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. adjusted close": string;
      "6. volume": string;
      "7. dividend amount": string;
    };
  };
}

export interface TimeSeriesMonthlyAdjustedResponse {
  "Meta Data": {
    "1. Information": string;
    "2. Symbol": Ticker;
    "3. Last Refreshed": DateTimeString;
    "4. Time Zone": string;
  };
  "Monthly Time Series": {
    [key: ISODate]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. adjusted close": string;
      "6. volume": string;
      "7. dividend amount": string;
    };
  };
}

export interface NewsFeedItem {
  title: string;
  url: string;
  time_published: string; // number of ms
  authors: string[];
  summary: string;
  banner_image: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: {
    topic: string;
    relevance_score: string; // number
  }[];
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: {
    ticker: Ticker;
    relevance_score: string; // number
    ticker_sentiment_score: string; // number
    ticker_sentiment_label: string;
  }[];
}

export interface NewsResponse {
  items: string; // number
  sentiment_score_definition: string;
  relevance_score_definition: string;
  feed: NewsFeedItem[];
}

// IEXCLOUD

export interface IEXCloudHistoricalData {
  close: number;
  fclose: number;
  fhigh: number;
  flow: number;
  fopen: number;
  fvolume: number;
  high: number;
  low: number;
  open: number;
  priceDate: ISODate; // ISO DAte
  symbol: Ticker;
  uclose: number;
  uhigh: number;
  ulow: number;
  uopen: number;
  uvolume: number;
  volume: number;
  id: string; // "HISTORICAL_PRICES",
  key: Ticker;
  subkey: string;
  date: number;
  updated: number;
}

export interface IEXCloudIncomeStatement {
  costOfRevenue: number;
  currency: string;
  ebit: number;
  filingType: string;
  fiscalDate: ISODate;
  fiscalQuarter: number;
  fiscalYear: number;
  grossProfit: number;
  incomeTax: number;
  interestIncome: number;
  minorityInterest: number;
  netIncome: number;
  netIncomeBasic: number;
  operatingExpense: number;
  operatingIncome: number;
  otherIncomeExpenseNet: number;
  pretaxIncome: number;
  reportDate: ISODate;
  researchAndDevelopment: number;
  sellingGeneralAndAdmin: number;
  symbol: Ticker;
  totalRevenue: number;
  id: string; // 'INCOME';
  key: Ticker;
  subkey: "quarterly" | "annual";
  date: number;
  updated: number;
}

export interface IEXCloudBalanceSheet {
  accountsPayable: number;
  capitalSurplus: number | null;
  commonStock: number;
  currency: string;
  currentAssets: number;
  currentCash: number;
  currentLongTermDebt: number;
  filingType: string;
  fiscalDate: ISODate;
  fiscalQuarter: number;
  fiscalYear: number;
  goodwill: number;
  intangibleAssets: number;
  inventory: number;
  longTermDebt: number;
  longTermInvestments: number;
  minorityInterest: number;
  netTangibleAssets: number;
  otherAssets: number;
  otherCurrentAssets: number;
  otherCurrentLiabilities: number;
  otherLiabilities: number;
  propertyPlantEquipment: number;
  receivables: number;
  reportDate: ISODate;
  retainedEarnings: number;
  shareholderEquity: number;
  shortTermInvestments: number;
  symbol: Ticker;
  totalAssets: number;
  totalCurrentLiabilities: number;
  totalLiabilities: number;
  treasuryStock: number;
  id: string; // "BALANCE_SHEET",
  key: Ticker;
  subkey: "quarterly" | "annual";
  date: number;
  updated: number;
}
