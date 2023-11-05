import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import { GrossRentalYield } from "./gross-rental-yield.component";
import { NetRentalYield } from "./net-rental-yield.component";
import Divider from "@mui/material/Divider";

export const RentalYieldsCard = () => {
  return (
    <Card>
      <CardHeader title="Rental yields" />
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <GrossRentalYield />
        <Divider />
        <NetRentalYield />
      </CardContent>
    </Card>
  );
};
