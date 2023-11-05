import React, { useState } from "react";
import { Title } from "../../../util/components/title.component";
import { Content } from "../../../util/components/content.component";
import { Box, Button } from "@mui/material";
import { BalanceSheetSection } from "./balance-sheet/balance-sheet.section";
import { CashFlowStatementSection } from "./cashflow-statement/cashflow-statement.section";
import { IncomeStatementSection } from "./income-statement/income-statement.section";

const enum FinancialTabs {
  INCOME_STATEMENT = "Income Statement",
  BALANCE_SHEET = "Balance Sheet",
  CASH_FLOW = "Cash Flow",
}

export const FinancialsPage = () => {
  const [tab, setTab] = useState<FinancialTabs>(FinancialTabs.INCOME_STATEMENT);

  return (
    <Content>
      <Title>Financials</Title>

      <Box style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <Button
          variant={
            tab === FinancialTabs.INCOME_STATEMENT ? "contained" : "outlined"
          }
          onClick={() => setTab(FinancialTabs.INCOME_STATEMENT)}
        >
          Income Statement
        </Button>
        <Button
          variant={
            tab === FinancialTabs.BALANCE_SHEET ? "contained" : "outlined"
          }
          onClick={() => setTab(FinancialTabs.BALANCE_SHEET)}
        >
          Balance Sheet
        </Button>
        <Button
          variant={tab === FinancialTabs.CASH_FLOW ? "contained" : "outlined"}
          onClick={() => setTab(FinancialTabs.CASH_FLOW)}
        >
          Cash Flow
        </Button>
      </Box>

      {tab === FinancialTabs.INCOME_STATEMENT ? (
        <IncomeStatementSection />
      ) : tab === FinancialTabs.BALANCE_SHEET ? (
        <BalanceSheetSection />
      ) : tab === FinancialTabs.CASH_FLOW ? (
        <CashFlowStatementSection />
      ) : null}
    </Content>
  );
};
