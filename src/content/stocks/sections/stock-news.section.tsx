import React, { useEffect, useState } from "react"
import { StockAPI } from "../../../api/stock.api";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { NewsFeedItem } from "../../../types/stock.type";

export const StockNews = ({ ticker }: { ticker: string}) => {
    const [news, setNews] = useState<NewsFeedItem[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const news = await StockAPI.getStockNewsByTicker(ticker);
                setNews(news);
            } catch(error) {
                console.error(error);
            }
        })();
    }, [ticker])

    return <Box sx={{ width: '100%', height: 1, px: 2, overflowY: 'auto' }}>
        <Box sx={{ height: '50px'}}>
            <Typography variant='subtitle1' sx={{ fontWeight: 700, fontSize: 24, p: 1 }}>{ticker} News</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {news && news.map((item, index) => (            
            <Card key={index}>
                <CardContent>
                    <Typography variant='subtitle1' sx={{ mb: 1, fontWeight: 700 }}>{item.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 2}}>
                        <Box><img alt={item.title} width='200px' src={item.banner_image} /></Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between'}}>
                            <Typography variant='body1'>{item.summary}</Typography>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end'}}>
                                <Typography variant='body1'><a href={item.url} target="_blank" rel='noreferrer'>{item.source}</a></Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        ))}
    </Box></Box>
}