import React, { useState } from "react";
import { Title } from "../../../util/components/title.component";
import { Content } from "../../../util/components/content.component";
import { ScreenerIncomeStatementDrawer } from "./components/drawers/screener-income-statement-drawer.component";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Colors, ColorType, darkenColor } from "../../../css-style/colors";
import { Grade, ScreenerStockData } from "./screener.types";
import { ScreenerBalanceSheetDrawer } from "./components/drawers/screener-balance-sheet-drawer.component";
import { ScreenerCashFlowDrawer } from "./components/drawers/screener-cash-flow-drawer.component";
import { ScreenerValuationDrawer } from "./components/drawers/screener-valuation-drawer.component";
import { ScreenerRatiosDrawer } from "./components/drawers/screener-ratios-drawer.component";
import { ScreenerSummaryDrawer } from "./components/drawers/screener-summary-drawer.component";

const GradeToColor: Record<Grade, ColorType> = {
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

const getColSx = (grade: Grade, color?: ColorType) => ({
  bgcolor: color ?? GradeToColor[grade],
  color: Colors.NavyBlue,
  cursor: "pointer",
  ":hover": {
    bgcolor: darkenColor(color ?? GradeToColor[grade], -0.05),
  },
});

export const ScreenerPage = () => {
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [isValuationOpen, setIsValuationOpen] = useState<boolean>(false);
  const [isRatiosOpen, setIsRatiosOpen] = useState<boolean>(false);
  const [isIncomeStatementOpen, setIsIncomeStatementOpen] = useState<boolean>(false);
  const [isBalanceSheetOpen, setIsBalanceSheetOpen] = useState<boolean>(false);
  const [isCashFlowStatementOpen, setIsCashFlowStatementOpen] = useState<boolean>(false);
  const [stock, setStock] = useState<ScreenerStockData | null>(null);

  const stocks: ScreenerStockData[] = [
    {
      name: "PayPal",
      ticker: "PYPL",
      totalAvgGrade: 8,
      decision: null,
      notes: "",
      valuation: {
        avgGrade: 10,
        notes: "",
      },
      ratios: {
        avgGrade: 8,
        notes: "",
      },
      incomeStatement: {
        avgGrade: 7,
        notes: "",
      },
      balanceSheet: {
        avgGrade: 5,
        notes: "",
      },
      cashFlowStatement: {
        avgGrade: 1,
        notes: "",
      },
    },
  ];
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
      <ScreenerValuationDrawer
        isOpen={isValuationOpen}
        setIsOpen={setIsValuationOpen}
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
      />
      <ScreenerRatiosDrawer
        isOpen={isRatiosOpen}
        setIsOpen={setIsRatiosOpen}
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
      />
      <ScreenerIncomeStatementDrawer
        isOpen={isIncomeStatementOpen}
        setIsOpen={setIsIncomeStatementOpen}
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
      />
      <ScreenerBalanceSheetDrawer
        isOpen={isBalanceSheetOpen}
        setIsOpen={setIsBalanceSheetOpen}
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
      />
      <ScreenerCashFlowDrawer
        isOpen={isCashFlowStatementOpen}
        setIsOpen={setIsCashFlowStatementOpen}
        afterClose={() => {
          setStock(null);
        }}
        stock={stock}
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
