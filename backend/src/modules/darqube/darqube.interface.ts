import { ISODate } from '../stock/stock.interace';

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
  currency: 'USD' | 'EUR' | 'GBP';
  quarterly: {
    [date: string]: DarqubeBalanceSheet;
  };
  yearly: {
    [date: string]: DarqubeBalanceSheet;
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
  currency: 'USD' | 'EUR' | 'GBP';
  quarterly: {
    [date: string]: DarqubeIncomeStatement;
  };
  yearly: {
    [date: string]: DarqubeIncomeStatement;
  };
}

export interface DarqubeCashFlowResponse {
  currency: 'USD' | 'EUR' | 'GBP';
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

export interface DarqubeTickerNews {
  source: string;
  title: string;
  url: string;
  published_at: number;
  score: {
    neg: number;
    neu: number;
    pos: number;
    compound: number;
  };
}

export interface DarqubeTickerTweet {
  text: string;
  created_at: number;
  uname: string;
  uscreen_name: string;
}
