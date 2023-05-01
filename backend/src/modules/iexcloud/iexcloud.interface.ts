import { Ticker, ISODate } from '../stock/stock.interace';
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
  subkey: 'quarterly' | 'annual';
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
  subkey: 'quarterly' | 'annual';
  date: number;
  updated: number;
}
