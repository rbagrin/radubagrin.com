import { Input } from "../../../../components/forms/Input";
import React, { useState } from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { MATH } from "../../../../util/math";

export const ApartmentCalculator = () => {
  const [price, setPrice] = useState<number | "">(100_000);
  const [deposit, setDeposit] = useState<number | "">(20);
  const [taxAndOtherCosts, setTaxAndOtherCosts] = useState<number>(20_000);

  const [mortgageYears, setMortgageYears] = useState<number | "">(30);
  const [interestRate, setInterestRate] = useState<number | "">(5);
  const [monthlyRent, setMonthlyRent] = useState<number | "">(600);

  const initialCost = Number(price) + Number(taxAndOtherCosts);
  const depositValue = Number(price) * (Number(deposit) / 100);
  const mortgageValue = Number(price) - Number(depositValue);

  const pmt = MATH.PMT(
    Number(interestRate) / 12 / 100, // TODO: get monthly interest rate from annual rate
    Number(mortgageYears) * 12,
    mortgageValue,
    0
  );

  return (
    <Card>
      <CardHeader title="Calculator apartment" />
      <CardContent>
        <Typography variant="body1">TODO</Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Input
            name="price"
            label="Price:"
            type="number"
            value={price}
            setValue={setPrice}
          />
          <Input
            name="taxAndOtherCosts"
            label="Tax and other costs"
            type="number"
            value={taxAndOtherCosts}
            setValue={setTaxAndOtherCosts}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2">Initial cost</Typography>
            <Typography variant="h4">${initialCost}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Input
            name="deposit"
            label="Deposit (%)"
            type="number"
            value={deposit}
            setValue={setDeposit}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2">Deposit value</Typography>
            <Typography variant="h4">${depositValue}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2">Mortgage value</Typography>
            <Typography variant="h4">${mortgageValue}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Input
            name="interestRate"
            label="Interest rate (%)"
            type="number"
            value={interestRate}
            setValue={setInterestRate}
          />
          <Input
            name="mortgageYears"
            label="Mortgage periods (Years)"
            type="number"
            value={mortgageYears}
            setValue={setMortgageYears}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2">PMT</Typography>
            <Typography variant="h4">${pmt}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Input
            name="monthlyRent"
            label="Monthly rent"
            type="number"
            value={monthlyRent}
            setValue={setMonthlyRent}
          />
        </Box>

        <Divider />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2">Fair price</Typography>
          <Typography variant="h4">${price}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
