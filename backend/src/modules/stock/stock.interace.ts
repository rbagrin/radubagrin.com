export type DateTimeString = string;
export type ISODate = string;
export type Ticker = string;
export type NumberString = string;

export interface TimeSeriesDailyAdjustedResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': Ticker;
    '3. Last Refreshed': DateTimeString;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
  'Time Series (Daily)': {
    [key: ISODate]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. adjusted close': string;
      '6. volume': string;
      '7. dividend amount': string;
      '8. split coefficient': string;
    };
  };
}

export interface TimeSeriesWeeklyAdjustedResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': Ticker;
    '3. Last Refreshed': DateTimeString;
    '4. Time Zone': string;
  };
  'Weekly Adjusted Time Series': {
    [key: ISODate]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. adjusted close': string;
      '6. volume': string;
      '7. dividend amount': string;
    };
  };
}

export interface TimeSeriesMonthlyAdjustedResponse {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': Ticker;
    '3. Last Refreshed': DateTimeString;
    '4. Time Zone': string;
  };
  'Monthly Time Series': {
    [key: ISODate]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. adjusted close': string;
      '6. volume': string;
      '7. dividend amount': string;
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
