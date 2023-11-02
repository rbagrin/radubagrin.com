import React, { useState } from "react";
import { IncomeStatementSection } from "./income-statement/income-statement.section";
import { Title } from "../../../util/components/title.component";
import { Content } from "../../../util/components/content.component";

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

      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <button
          className={
            tab === FinancialTabs.INCOME_STATEMENT ? undefined : "secondary"
          }
          onClick={() => setTab(FinancialTabs.INCOME_STATEMENT)}
        >
          Income Statement
        </button>
        <button
          className={
            tab === FinancialTabs.BALANCE_SHEET ? undefined : "secondary"
          }
          onClick={() => setTab(FinancialTabs.BALANCE_SHEET)}
        >
          Balance Sheet
        </button>
        <button
          className={tab === FinancialTabs.CASH_FLOW ? undefined : "secondary"}
          onClick={() => setTab(FinancialTabs.CASH_FLOW)}
        >
          Cash Flow
        </button>
      </div>

      {tab === FinancialTabs.INCOME_STATEMENT ? (
        <IncomeStatementSection />
      ) : (
        <div>
          <p>{tab} tab coming soon...</p>
        </div>
      )}
    </Content>
  );
};
