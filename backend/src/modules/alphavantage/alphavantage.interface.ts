import {
  DateTimeString,
  ISODate,
  NumberString,
  Ticker,
} from '../stock/stock.interace';

export interface AlphavantageNewsItem {
  title: string;
  url: string;
  time_published: DateTimeString; // number
  authors: string[];
  summary: string;
  banner_image: string;
  source: string;
  category_within_source: string;
  source_domain: string;
  topics: {
    topic: string;
    relevance_score: string; //float
  }[];
  overall_sentiment_score: number;
  overall_sentiment_label: string;
  ticker_sentiment: {
    ticker: Ticker;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }[];
}

export interface AlphavantageNewsResponse {
  items: string; // number
  sentiment_score_definition: string;
  relevance_score_definition: string;
  feed: AlphavantageNewsItem[];
}

export interface AlphavantageOverviewResponse {
  Symbol: Ticker;
  AssetType: 'Common Stock' | string;
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
  '52WeekHigh': NumberString; // '197.96';
  '52WeekLow': NumberString; // '123.64';
  '50DayMovingAverage': NumberString; // '177.02';
  '200DayMovingAverage': NumberString; // '170.36';
  SharesOutstanding: NumberString; // '15634200000';
  DividendDate: ISODate; // '2023-08-17';
  ExDividendDate: ISODate; // '2023-08-11';
}
