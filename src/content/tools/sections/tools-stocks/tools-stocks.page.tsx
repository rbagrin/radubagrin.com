import React from "react";
import { Content } from "../../../../util/components/content.component";
import { PresentValueSection } from "./present-value.section";
import { CAGRSection } from "./cagr.section";
import { InvestmentCalculatorSection } from "./investment-calculator.section";
import { Box } from "@mui/material";
import { Title } from "../../../../util/components/title.component";

export const ToolsStocksPage = () => {
  return (
    <Content>
      <Title>Stocks</Title>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <InvestmentCalculatorSection />
        <PresentValueSection />
        <CAGRSection />
      </Box>
    </Content>
  );
};
