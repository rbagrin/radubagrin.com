import React, { useMemo, useState } from "react";
import { round } from "../../../../util/number.util";
import { Input } from "../../../../components/forms/Input";
import { Box, Typography } from "@mui/material";

export const GrossRentalYield = () => {
  const [monthlyRent, setMonthlyRent] = useState<number | "">(500);
  const [purchasePrice, setPurchasePrice] = useState<number | "">(100_000);

  // TODO: add example section
  const grossRentalYield = useMemo(() => {
    return round((12 * Number(monthlyRent) * 100) / Number(purchasePrice), 2);
  }, [monthlyRent, purchasePrice]);

  return (
    <div style={{ width: "100%" }}>
      <h3>Gross Rental Yield</h3>
      <code>GrossRentalYield = annualRent * 100% / purchasePrice;</code>

      <h4>What is a good rental yield – and where can I get it?</h4>
      <p>
        As a rule of thumb, between <b>6%</b> and <b>8%</b> is considered to be
        a <b>reasonable</b> level of rental yield, but different parts of the
        country can deliver significantly higher or lower returns. It is worth
        bearing in mind that yields can be lower in areas where the expected
        house price growth is highest, such as in London and the South East of
        England. This is because the potential for capital gains in the region
        pushes sale prices up, while rent levels are less affected.
      </p>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Input
          name="purchasePrice"
          label="Purchase price:"
          type="number"
          value={purchasePrice}
          setValue={setPurchasePrice}
        />
        <Input
          name="monthlyRent"
          label="Monthly rent:"
          type="number"
          value={monthlyRent}
          setValue={setMonthlyRent}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ml: 2 }}>
          <Typography variant="body2">Gross Rental Yield</Typography>
          <Typography variant="h4">{grossRentalYield}%</Typography>
        </Box>
      </Box>
    </div>
  );
};
