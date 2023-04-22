import axios from "axios";

let AAPL_DATA = null;
let IBM_DATA = null;

export class StockAPI {
    static async getDailyAdjustedDataByTicker(ticker: string): Promise<TimeSeriesDailyAdjustedResponse> {
        if (ticker === 'AAPL' && AAPL_DATA) return {...AAPL_DATA};
        if (ticker !== 'AAPL' && IBM_DATA) return {...IBM_DATA};

        let res = (await axios.get(`/api/stocks/${ticker}/daily-adjusted`)).data;
        
        if (ticker === 'AAPL') AAPL_DATA = res;
        else IBM_DATA = res;
        
        return res;
    }

    static async getWeeklyAdjustedDataByTicker(ticker: string): Promise<TimeSeriesWeeklyAdjustedResponse> {
        return (await axios.get(`/api/stocks/${ticker}/weekly-adjusted`)).data;
    }

    static async getMonthlyAdjustedDataByTicker(ticker: string): Promise<TimeSeriesMonthlyAdjustedResponse> {
        return (await axios.get(`/api/stocks/${ticker}/monthly-adjusted`)).data;
    }
}