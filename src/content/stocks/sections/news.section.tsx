import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import React, { useContext } from "react";
import { Ticker, TickerNewsItem } from "../../../types/stock.type";
import { GlobalState } from "../../../util/global-state/global-state";

export const NewsSection = ({
  ticker,
  news,
}: {
  ticker: Ticker;
  news: TickerNewsItem[];
}) => {
  const { state } = useContext(GlobalState);
  const isDarkMode = state.darkMode;

  return (
    <Card>
      <CardHeader title={`${ticker} News`} />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        {news &&
          news.map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 1,
                ":hover": {
                  borderRadius: "15px",
                  cursor: "pointer",
                  bgcolor: isDarkMode ? "#2F2F2F" : "#F2F2F2",
                },
              }}
              onClick={() => window.open(item.url, "_blank", "noreferrer")}
            >
              <Box>
                <Typography style={{ marginBottom: 1, fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Box style={{ display: "flex", gap: 2 }}>
                  {item.img && (
                    <div>
                      <img alt={item.title} width="200px" src={item.img} />
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    {item.summary && <p>{item.summary}</p>}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          {item.source}
                        </a>
                      </p>
                      <p>
                        Published at:{" "}
                        {new Date(item.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Box>
              </Box>
            </Box>
          ))}
      </CardContent>
    </Card>
  );
};
