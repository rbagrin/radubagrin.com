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

export interface TickerNewsItem {
  source: string;
  title: string;
  url: string;
  publishedAt: number;
  authors?: string[];
  summary?: string;
  img?: string;
  score?: {
    neg: number;
    neu: number;
    pos: number;
    compound: number;
  };
}

export interface DarqubeBalanceSheet {
  totalAssets: number;
  totalCurrentAssets: number;
  cashAndShortTermInvestments: number;
  cash: number;
  shortTermInvestments: number | null;
  netReceivables: number;
  inventory: number;
  otherCurrentAssets: number;
  nonCurrrentAssetsOther: number;
  propertyPlantEquipment: number | null;
  propertyPlantAndEquipmentGross: number | null;
  accumulatedDepreciation: number | null;
  longTermInvestments: number | null;
  goodWill: number | null;
  intangibleAssets: number | null;
  otherAssets: number | null;
  netTangibleAssets: number | null;
  nonCurrentAssetsTotal: number | null;
  liabilitiesAndStockholdersEquity: number | null;
  totalLiab: number | null;
  totalCurrentLiabilities: number | null;
  shortTermDebt: number | null;
  shortLongTermDebtTotal: number | null;
  capitalLeaseObligations: number | null;
  accountsPayable: number | null;
  otherCurrentLiab: number | null;
  nonCurrentLiabilitiesTotal: number | null;
  longTermDebtTotal: number | null;
  longTermDebt: number | null;
  otherLiab: number | null;
  deferredLongTermLiab: number | null;
  deferredLongTermAssetCharges: number | null;
  nonCurrentLiabilitiesOther: number | null;
  totalStockholderEquity: number | null;
  commonStockTotalEquity: number | null;
  commonStock: number | null;
  commonStockSharesOutstanding: number | null;
  additionalPaidInCapital: number | null;
  treasuryStock: number | null;
  preferredStockTotalEquity: number | null;
  preferredStockRedeemable: number | null;
  retainedEarningsTotalEquity: number | null;
  retainedEarnings: number | null;
  accumulatedOtherComprehensiveIncome: number | null;
  otherStockholderEquity: number | null;
  totalPermanentEquity: number | null;
  noncontrollingInterestInConsolidatedEntity: number | null;
  temporaryEquityRedeemableNoncontrollingInterests: number | null;
  accumulatedAmortization: number | null;
  negativeGoodwill: number | null;
  warrants: number | null;
  capitalSurpluse: number | null;
  date: ISODate;
  filing_date: ISODate;
  netDebt: number | null;
  earningAssets: number | null;
  netWorkingCapital: number | null;
  netInvestedCapital: number | null;
}
export interface DarqubeBalanceSheetResponse {
  currency: "USD" | "EUR" | "GBP";
  quarterly: {
    [date: string]: DarqubeBalanceSheet;
  };
  yearly: {
    [date: string]: DarqubeBalanceSheet;
  };
}

export interface DarqubeIncomeStatement {
  totalRevenue: number;
  costOfRevenue: number;
  grossProfit: number;
  totalOperatingExpenses: number;
  researchDevelopment: number;
  sellingGeneralAdministrative: number | null;
  discontinuedOperations: number | null;
  otherOperatingExpenses: number | null;
  operatingIncome: number | null;
  interestIncome: number | null;
  totalOtherIncomeExpenseNet: number | null;
  nonOperatingIncomeNetOther: number | null;
  incomeBeforeTax: number | null;
  taxProvision: number | null;
  incomeTaxExpense: number | null;
  extraordinaryItems: number | null;
  minorityInterest: number | null;
  effectOfAccountingCharges: number | null;
  nonRecurring: number | null;
  otherItems: number | null;
  netIncome: number | null;
  preferredStockAndOtherAdjustments: number | null;
  netIncomeApplicableToCommonShares: number | null;
  ebit: number | null;
  dilutedWeightedAverageShares: number | null;
  netIncomeAfterTaxes: number | null;
  netIncomeBeforeExtraordinaryItems: number | null;
  dilutedNetIncome: number | null;
  dilutedEPSExcludingExtraordinaryItems: number | null;
  dilutedNormalizedEPS: number | null;
}

export interface DarqubeIncomeStatementResponse {
  currency: "USD" | "EUR" | "GBP";
  quarterly: {
    [date: string]: DarqubeIncomeStatement;
  };
  yearly: {
    [date: string]: DarqubeIncomeStatement;
  };
}

export interface DarqubeTickerMarketData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted_close: number;
  time: number;
}
