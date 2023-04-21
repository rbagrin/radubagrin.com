import axios from "axios";

let data = null;

export class StockAPI {
    static async getDailyAdjustedDataByTicker(ticker: string): Promise<TimeSeriesDailyAdjustedResponse> {
        console.log("BEFORE");
        if (data) return {...data};

        console.log('AFTER')
        let res = (await axios.get(`/api/stocks/${ticker}/daily-adjusted`)).data;
        data = res;
        return data;
    }

    static async getWeeklyAdjustedDataByTicker(ticker: string): Promise<TimeSeriesWeeklyAdjustedResponse> {
        return (await axios.get(`/api/stocks/${ticker}/weekly-adjusted`)).data;
    }

    static async getMonthlyAdjustedDataByTicker(ticker: string): Promise<TimeSeriesMonthlyAdjustedResponse> {
        return (await axios.get(`/api/stocks/${ticker}/monthly-adjusted`)).data;
    }
}