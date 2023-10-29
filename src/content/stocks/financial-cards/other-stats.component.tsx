import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import {
  AlphavantageOverviewResponse,
  Ticker,
} from "../../../types/stock.type";
import { shortenNumber } from "../../../util/number.util";
import { CardField } from "./components/card-field.component";

interface OtherStatsProps {
  readonly ticker: Ticker;
  readonly companyOverview: AlphavantageOverviewResponse;
}

export const OtherStats = ({ ticker, companyOverview }: OtherStatsProps) => {
  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        title={
          <Box>
            <Typography variant="h5">Other stats</Typography>
            <Typography variant="h6" sx={{ color: "grey" }}>
              {ticker}
            </Typography>
          </Box>
        }
      />

      <CardContent>
        <Grid container spacing={4}>
          <Grid item md={6} xs={10}>
            {/* TODO: check all this data matches yahoo finance records */}
            <Typography variant="caption">Ratios</Typography>
            <CardField l="PEG" v={companyOverview.PEGRatio} />
            <CardField l="P/E" v={companyOverview.PERatio} />
            <CardField
              l="P/S"
              v={shortenNumber(
                Number(companyOverview.MarketCapitalization) /
                  Number(companyOverview.RevenueTTM)
              )}
            />
            <CardField l="EPS" v={companyOverview.EPS} />

            <CardField l="Book value per share" v={companyOverview.BookValue} />
            <CardField
              l="Price to Book ratio"
              v={companyOverview.PriceToBookRatio}
            />
            {/*<CardField l="EVToEBITDA" v={companyOverview.EVToEBITDA} />*/}
            {/*<CardField l="EVToRevenue" v={companyOverview.EVToRevenue} />*/}
            <CardField l="Beta" v={companyOverview.Beta} />

            <Typography variant="caption">Dividends</Typography>
            <CardField
              l="Ex Dividend date"
              v={companyOverview.ExDividendDate}
            />
            <CardField l="Dividend date" v={companyOverview.DividendDate} />
            <CardField
              l="Dividend per share"
              v={companyOverview.DividendPerShare}
            />
            <CardField l="Dividend yield" v={companyOverview.DividendYield} />

            <CardField
              l="EBITDA"
              v={shortenNumber(Number(companyOverview.EBITDA))}
            />
          </Grid>
          <Grid item md={6} xs={10}>
            <CardField
              l="Market Cap"
              v={shortenNumber(Number(companyOverview.MarketCapitalization))}
            />
            <CardField l="ProfitMargin" v={companyOverview.ProfitMargin} />
            <CardField
              l="OperatingMarginTTM"
              v={companyOverview.OperatingMarginTTM}
            />
            <CardField
              l="GrossProfitTTM"
              v={shortenNumber(Number(companyOverview.GrossProfitTTM))}
            />

            <Typography variant="caption">TTM</Typography>
            <CardField
              l="ReturnOnAssetsTTM"
              v={companyOverview.ReturnOnAssetsTTM}
            />
            <CardField
              l="ReturnOnEquityTTM"
              v={companyOverview.ReturnOnEquityTTM}
            />
            <CardField
              l="RevenuePerShareTTM"
              v={companyOverview.RevenuePerShareTTM}
            />
            <CardField
              l="PriceToSalesRatioTTM"
              v={companyOverview.PriceToSalesRatioTTM}
            />

            <Typography variant="caption">Growth YoY</Typography>
            <CardField
              l="QuarterlyEarningsGrowthYOY"
              v={companyOverview.QuarterlyEarningsGrowthYOY}
            />
            <CardField
              l="QuarterlyRevenueGrowthYOY"
              v={companyOverview.QuarterlyRevenueGrowthYOY}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
