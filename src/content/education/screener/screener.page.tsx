import React, { useState } from "react";
import { Title } from "../../../util/components/title.component";
import { Content } from "../../../util/components/content.component";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Colors, ColorType, darkenColor } from "../../../css-style/colors";
import { Score, ScreenerStockData } from "./screener.types";
import { ScreenerSummaryDrawer } from "./components/drawers/screener-summary-drawer.component";
import { ScreenerSectionDrawer } from "./components/drawers/screener-section-drawer.component";

const GradeToColor: Record<Score, ColorType> = {
  10: Colors.StrongGreen,
  9: Colors.MediumGreen,
  8: Colors.LightGreen,
  7: Colors.GreenishYellow,
  6: Colors.GoldenYellow,
  5: Colors.MediumOrange,
  4: Colors.DarkOrange,
  3: Colors.LightRed,
  2: Colors.MediumRed,
  1: Colors.DarkRed,
};

const getColSx = (grade: Score, color?: ColorType) => ({
  bgcolor: color ?? GradeToColor[grade],
  color: Colors.NavyBlue,
  cursor: "pointer",
  ":hover": {
    bgcolor: darkenColor(color ?? GradeToColor[grade], -0.05),
  },
});

const getDefaultStockData = (name: string, ticker: string): ScreenerStockData => {
  const defaultScore = 5;
  const defaultNotes = "";
  return {
    name,
    ticker,
    totalAvgGrade: defaultScore,
    decision: null,
    notes: defaultNotes,
    valuation: {
      avgGrade: defaultScore,
      overviewNotes: defaultNotes,
      data: [
        {
          title: "DCF Valuation",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "Relative Valuation",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "AVG Valuation",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
      ],
    },
    ratios: {
      avgGrade: defaultScore,
      overviewNotes: defaultNotes,
      data: [
        {
          title: "EPS",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "should be growing",
        },
        {
          title: "PEG",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "P/E",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "P/E Avg, Median | P/E vs Industry",
        },
        {
          title: "P/S",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "P/S Avg, Median | P/S vs Industry",
        },
        {
          title: "P/B",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "P/FCF",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        //  <a href="https://www.investopedia.com/articles/fundamental-analysis/09/five-must-have-metrics-value-investors.asp">
        //               <strong>Valuation Ratios:</strong> P/E, P/B, P/FCF, P/S
        //               <strong>Profitability Ratios:</strong> ROE, ROA, Net Profit Margin, Gross Profit Margin, Operating Margin
        //               <strong>Liquidity Ratios:</strong> Current Ratio, Quick Ratio
        //               <strong>Leverage Ratios:</strong> Debt-to-Equity Ratio, Interest Coverage Ratio
        //               <strong>Efficiency Ratios:</strong> Asset Turnover, Inventory Turnover, Receivables Turnover
        //               <strong>Cash Flow Ratios:</strong> Operating Cash Flow Ratio, Free Cash Flow, FCF Yield
        //               <strong>Dividend Ratios:</strong> Dividend Yield, Dividend Payout Ratio
        //               <strong>Other Ratios:</strong> EPS, PEG Ratio, ROIC
      ],
    },
    incomeStatement: {
      avgGrade: defaultScore,
      overviewNotes: defaultNotes,
      data: [
        {
          title: "Revenue & Growth",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "Gross Income & Margin",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "Net income & Margin",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
      ],
    },
    balanceSheet: {
      avgGrade: defaultScore,
      overviewNotes: defaultNotes,
      data: [
        {
          title: "Assets-to-Liabilities Ratio",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "Current Assets-to-Liabilities Ratio",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "Current Assets, Cash, Current Liabilities, Quick Ratio",
        },
        {
          title: "Debt to Equity Ratio",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "Debt, Equity",
        },
      ],
    },
    cashFlowStatement: {
      avgGrade: defaultScore,
      overviewNotes: defaultNotes,
      data: [
        {
          title: "Cash From Operating Activities",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "Free Cash Flow",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "Issuance of Stock",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "",
        },
        {
          title: "CAPEX",
          enabled: false,
          score: defaultScore,
          notes: defaultNotes,
          info: "growth - but aligned with CFO",
        },
      ],
    },
  };
};

export const ScreenerPage = () => {
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [isValuationOpen, setIsValuationOpen] = useState<boolean>(false);
  const [isRatiosOpen, setIsRatiosOpen] = useState<boolean>(false);
  const [isIncomeStatementOpen, setIsIncomeStatementOpen] = useState<boolean>(false);
  const [isBalanceSheetOpen, setIsBalanceSheetOpen] = useState<boolean>(false);
  const [isCashFlowStatementOpen, setIsCashFlowStatementOpen] = useState<boolean>(false);
  const [stock, setStock] = useState<ScreenerStockData | null>(null);

  const stocks: ScreenerStockData[] = [getDefaultStockData("PayPal", "PYPL")];
  return (
    <Content maxWidth="lg">
      <Title>Screener</Title>

      <Grid container spacing={1}>
        <TableHeader />

        {stocks.map((item) => (
          <TableLine
            key={item.ticker}
            stockData={item}
            setStock={setStock}
            setIsSummaryOpen={setIsSummaryOpen}
            setIsValuationOpen={setIsValuationOpen}
            setIsRatiosOpen={setIsRatiosOpen}
            setIsIncomeStatementOpen={setIsIncomeStatementOpen}
            setIsBalanceSheetOpen={setIsBalanceSheetOpen}
            setIsCashFlowOpen={setIsCashFlowStatementOpen}
          />
        ))}
      </Grid>

      <ScreenerSummaryDrawer
        isOpen={isSummaryOpen}
        setIsOpen={setIsSummaryOpen}
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
      />
      <ScreenerSectionDrawer
        isOpen={isValuationOpen}
        setIsOpen={setIsValuationOpen}
        title="Valuation"
        section="valuation"
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
        setStock={setStock}
      />
      <ScreenerSectionDrawer
        isOpen={isRatiosOpen}
        setIsOpen={setIsRatiosOpen}
        title="Ratios"
        section="ratios"
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
        setStock={setStock}
      />
      <ScreenerSectionDrawer
        isOpen={isIncomeStatementOpen}
        setIsOpen={setIsIncomeStatementOpen}
        title="Income Statement"
        section="incomeStatement"
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
        setStock={setStock}
      />
      <ScreenerSectionDrawer
        isOpen={isBalanceSheetOpen}
        setIsOpen={setIsBalanceSheetOpen}
        title="Balance Sheet"
        section="balanceSheet"
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
        setStock={setStock}
      />
      <ScreenerSectionDrawer
        isOpen={isCashFlowStatementOpen}
        setIsOpen={setIsCashFlowStatementOpen}
        title="Cash Flow Statement"
        section="cashFlowStatement"
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
        setStock={setStock}
      />
    </Content>
  );
};

const TableHeader = () => {
  const headerSx = { bgcolor: Colors.NavyBlue, color: Colors.White };
  return (
    <>
      <Grid item xs={2} sx={headerSx}>
        Ticker
      </Grid>
      <Grid item xs={2} sx={headerSx}>
        Valuation
      </Grid>
      <Grid item xs={2} sx={headerSx}>
        Ratios
      </Grid>
      <Grid item xs={2} sx={headerSx}>
        Income statement
      </Grid>
      <Grid item xs={2} sx={headerSx}>
        Balance sheet
      </Grid>
      <Grid item xs={2} sx={headerSx}>
        Cash flow statement
      </Grid>
    </>
  );
};

const TableLine = ({
  stockData,
  setStock,
  setIsSummaryOpen,
  setIsValuationOpen,
  setIsRatiosOpen,
  setIsIncomeStatementOpen,
  setIsBalanceSheetOpen,
  setIsCashFlowOpen,
}: {
  stockData: ScreenerStockData;
  setStock: React.Dispatch<React.SetStateAction<ScreenerStockData | null>>;
  setIsSummaryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsValuationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRatiosOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsIncomeStatementOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBalanceSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCashFlowOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <Grid
        item
        xs={2}
        onClick={() => {
          setStock(stockData);
          setIsSummaryOpen(true);
        }}
        sx={getColSx(2, Colors.LightGray)}
      >
        <Typography>{stockData.name}</Typography>
        <Typography>{stockData.ticker}</Typography>
      </Grid>
      <Grid
        item
        xs={2}
        onClick={() => {
          setStock(stockData);
          setIsValuationOpen(true);
        }}
        sx={getColSx(stockData.valuation.avgGrade)}
      >
        Valuation grade
      </Grid>
      <Grid
        item
        xs={2}
        onClick={() => {
          setStock(stockData);
          setIsRatiosOpen(true);
        }}
        sx={getColSx(stockData.ratios.avgGrade)}
      >
        Ratios grade
      </Grid>
      <Grid
        item
        xs={2}
        onClick={() => {
          setStock(stockData);
          setIsIncomeStatementOpen(true);
        }}
        sx={getColSx(stockData.incomeStatement.avgGrade)}
      >
        Income statement grade
      </Grid>
      <Grid
        item
        xs={2}
        onClick={() => {
          setStock(stockData);
          setIsBalanceSheetOpen(true);
        }}
        sx={getColSx(stockData.balanceSheet.avgGrade)}
      >
        Balance sheet grade
      </Grid>
      <Grid
        item
        xs={2}
        onClick={() => {
          setStock(stockData);
          setIsCashFlowOpen(true);
        }}
        sx={getColSx(stockData.cashFlowStatement.avgGrade)}
      >
        Cash flow statement grade
      </Grid>
    </>
  );
};
