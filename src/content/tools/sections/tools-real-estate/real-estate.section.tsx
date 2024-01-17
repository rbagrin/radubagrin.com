import React from "react";
import { Title } from "../../../../util/components/title.component";
import { Content } from "../../../../util/components/content.component";
import { FairValueCard } from "./fair-value-card.component";
import { RentalYieldsCard } from "./rental-yields-card.component";
import { GraficeImobiliareRo } from "./grafice-imbobiliare-ro.component";
import { Box } from "@mui/material";
import { MyOwnDataChart } from "./my-own-data-chart.component";
import { ApartmentCalculator } from "./apartment-calculator.component";

export const RealEstateSection = () => {
  return (
    <Content>
      <Title>Real estate</Title>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <FairValueCard />

        <ApartmentCalculator />

        <RentalYieldsCard />

        <MyOwnDataChart />

        <GraficeImobiliareRo />
      </Box>
    </Content>
  );
};
