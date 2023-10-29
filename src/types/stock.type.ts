export type DateTimeString = string;
export type ISODate = string;
export type Ticker = string;
export type NumberString = string;

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

export interface DarqubeCashFlow {
  totalCashFromOperatingActivities: number;
  changeReceivables: number | null;
  changeToLiabilities: number | null;
  totalCashflowsFromInvestingActivities: number | null;
  investments: number | null;
  capitalExpenditures: number | null;
  totalCashFromFinancingActivities: number | null;
  dividendsPaid: number | null;
  otherCashflowsFromFinancingActivities: number | null;
  netBorrowings: number | null;
  salePurchaseOfStock: number | null;
  exchangeRateChanges: number | null;
  changeInCash: number | null;
  cashAndCashEquivalentsChanges: number | null;
  freeCashFlow: number | null;
  otherInvestments: number | null;
  operatingCashFlow: number | null;
  issuanceOfCommonStockAndPreferredStock: number | null;
  otherInvestingCashFlowItemsTotal: number | null;
  issuanceOfStock: number;
}

export interface DarqubeCashFlowResponse {
  currency: "USD" | "EUR" | "GBP";
  quarterly: {
    [date: string]: DarqubeCashFlow;
  };
  yearly: {
    [date: string]: DarqubeCashFlow;
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

export interface DBStock {
  _id: string;
  name: string;
  ticker: Ticker;
  createdAt: string;
}

export interface AlphavantageOverviewResponse {
  Symbol: Ticker;
  AssetType: "Common Stock" | string;
  Name: string;
  Description: string;
  CIK: string;
  Exchange: string; // 'NASDAQ';
  Currency: string; // 'USD';
  Country: string; // 'USA';
  Sector: string; // 'TECHNOLOGY';
  Industry: string; // 'ELECTRONIC COMPUTERS';
  Address: string;
  FiscalYearEnd: string; // 'September';
  LatestQuarter: ISODate; //  '2023-06-30';
  MarketCapitalization: NumberString; // '2609191584000';
  EBITDA: NumberString; // '123957002000';
  PERatio: NumberString; // '28.0';
  PEGRatio: NumberString; // '2.75';
  BookValue: NumberString; // '3.852';
  DividendPerShare: NumberString; // '0.93';
  DividendYield: NumberString; // '0.0058';
  EPS: NumberString; // '5.96';
  RevenuePerShareTTM: NumberString; // '24.22';
  ProfitMargin: NumberString; // '0.247';
  OperatingMarginTTM: NumberString; // '0.281';
  ReturnOnAssetsTTM: NumberString; // '0.209';
  ReturnOnEquityTTM: NumberString; // '1.601';
  RevenueTTM: NumberString; // '383932989000';
  GrossProfitTTM: NumberString; // '170782000000';
  DilutedEPSTTM: NumberString; // '5.96';
  QuarterlyEarningsGrowthYOY: NumberString; // '0.05';
  QuarterlyRevenueGrowthYOY: NumberString; // '-0.014';
  AnalystTargetPrice: NumberString; // '187.73';
  TrailingPE: NumberString; // '28.0';
  ForwardPE: NumberString; // '28.66';
  PriceToSalesRatioTTM: NumberString; // '5.51';
  PriceToBookRatio: NumberString; // '44.63';
  EVToRevenue: NumberString; // '5.92';
  EVToEBITDA: NumberString; // '23.52';
  Beta: NumberString; // '1.308';
  "52WeekHigh": NumberString; // '197.96';
  "52WeekLow": NumberString; // '123.64';
  "50DayMovingAverage": NumberString; // '177.02';
  "200DayMovingAverage": NumberString; // '170.36';
  SharesOutstanding: NumberString; // '15634200000';
  DividendDate: ISODate; // '2023-08-17';
  ExDividendDate: ISODate; // '2023-08-11';
}
