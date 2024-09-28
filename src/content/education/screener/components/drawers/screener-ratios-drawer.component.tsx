import React from "react";
import { MyDrawer } from "../../../../../components/MyDrawer";
import { Box, Divider } from "@mui/material";
import { ScreenerStockData } from "../../screener.types";
import Typography from "@mui/material/Typography";
import { LoaderCircular } from "../../../../../util/components/loader-circular.component";

export const ScreenerRatiosDrawer = ({
  isOpen,
  setIsOpen,
  afterClose,
  stock,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stock: ScreenerStockData | null;
  afterClose?: () => void;
}) => {
  return (
    <MyDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Ratios" width="medium" afterClose={afterClose}>
      {stock ? (
        <Box>
          <Typography>{stock.name}</Typography>
          <a href="https://www.investopedia.com/articles/fundamental-analysis/09/five-must-have-metrics-value-investors.asp">
            5 Must-Have Metrics for Value Investors
          </a>
          <Divider />

          <Typography>EPS - should be growing</Typography>
          <Typography>PEG</Typography>

          <Divider />
          <Typography>PE</Typography>
          <Typography>PE Median </Typography>
          <Typography>PE vs Industry</Typography>
          <Divider />

          <Typography>P/B</Typography>
          <Divider />

          <Typography>D/E</Typography>
          <Divider />

          <Typography>FCF</Typography>

          <Divider />
          <h2>Summary of Key Ratios</h2>
          <ul>
            <li>
              <strong>Valuation Ratios:</strong> P/E, P/B, P/FCF, P/S
            </li>
            <li>
              <strong>Profitability Ratios:</strong> ROE, ROA, Net Profit Margin, Gross Profit Margin, Operating Margin
            </li>
            <li>
              <strong>Liquidity Ratios:</strong> Current Ratio, Quick Ratio
            </li>
            <li>
              <strong>Leverage Ratios:</strong> Debt-to-Equity Ratio, Interest Coverage Ratio
            </li>
            <li>
              <strong>Efficiency Ratios:</strong> Asset Turnover, Inventory Turnover, Receivables Turnover
            </li>
            <li>
              <strong>Cash Flow Ratios:</strong> Operating Cash Flow Ratio, Free Cash Flow, FCF Yield
            </li>
            <li>
              <strong>Dividend Ratios:</strong> Dividend Yield, Dividend Payout Ratio
            </li>
            <li>
              <strong>Other Ratios:</strong> EPS, PEG Ratio, ROIC
            </li>
          </ul>
        </Box>
      ) : (
        <LoaderCircular />
      )}
    </MyDrawer>
  );
};
