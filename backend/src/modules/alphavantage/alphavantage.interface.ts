import { DateTimeString, Ticker } from '../stock/stock.interace';

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
