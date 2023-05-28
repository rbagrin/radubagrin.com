import React from "react";
import { InvestmentCalculatorSection } from "../investment-calculator.section";
import { MAX_PAGE_WIDTH } from "../../../../css-style/style";

export const ToolsStocksPage = () => {
  return (
    <div style={{ width: "100%", maxWidth: MAX_PAGE_WIDTH }}>
      <InvestmentCalculatorSection />
    </div>
  );
};
