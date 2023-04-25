import axios from "axios";
import { NewsFeedItem, NewsResponse, TimeSeriesDailyAdjustedResponse, TimeSeriesMonthlyAdjustedResponse, TimeSeriesWeeklyAdjustedResponse } from "../types/stock.type";

const STOCKS_DAILY_DATA_CACHE = {};

let STOCKS_NEWS_CACHE = null;

export class StockAPI {
    static async getDailyAdjustedDataByTicker(ticker: string): Promise<TimeSeriesDailyAdjustedResponse> {
        if (STOCKS_DAILY_DATA_CACHE[ticker]) return STOCKS_DAILY_DATA_CACHE[ticker];

        const res = (await axios.get(`/api/stocks/${ticker}/daily-adjusted`)).data;
        
        // save data in cache
        STOCKS_DAILY_DATA_CACHE[ticker] = res;
        
        return res;
    }

    static async getWeeklyAdjustedDataByTicker(ticker: string): Promise<TimeSeriesWeeklyAdjustedResponse> {
        return (await axios.get(`/api/stocks/${ticker}/weekly-adjusted`)).data;
    }

    static async getMonthlyAdjustedDataByTicker(ticker: string): Promise<TimeSeriesMonthlyAdjustedResponse> {
        return (await axios.get(`/api/stocks/${ticker}/monthly-adjusted`)).data;
    }

    static async getStockNewsByTicker(ticker: string): Promise<NewsFeedItem[]> {
        let source = STOCKS_NEWS_CACHE;
        if (!source) {
            const res = (await axios.get<NewsResponse>(`/api/stocks/${ticker}/news`)).data;
            source = res;
            STOCKS_NEWS_CACHE = source;
        }

        return source.feed.filter((item) => item.ticker_sentiment.some((ts) => ts.ticker === ticker));

        // return res;
    }
}