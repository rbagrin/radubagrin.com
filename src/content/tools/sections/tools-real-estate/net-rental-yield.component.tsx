import React, { useMemo, useState } from "react";
import { round } from "../../../../util/number.util";
import { Input } from "../../../../components/forms/Input";
import { Box, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";

export const NetRentalYield = () => {
  const [monthlyRent, setMonthlyRent] = useState<number | "">(500);
  const [purchasePrice, setPurchasePrice] = useState<number | "">(100_000);
  const [runningCosts, setRunningCosts] = useState<number | "">(50);
  const [oneTimeCosts, setOneTimeCosts] = useState<number | "">(100);

  // TODO: add example section
  const netRentalYield = useMemo(() => {
    const mr = Number(monthlyRent);
    const rc = Number(runningCosts);
    const pp = Number(purchasePrice);
    const otc = Number(oneTimeCosts);
    return round(((12 * mr - mr - rc) / (pp + otc)) * 100, 2);
  }, [monthlyRent, purchasePrice, oneTimeCosts, runningCosts]);

  return (
    <div style={{ width: "100%" }}>
      <Typography variant="h6">Net Rental Yield</Typography>
      <Typography variant="body1">
        Net Rental Yield is a financial metric used in real estate investment to
        assess the profitability of an income-generating property, taking into
        account various expenses associated with property ownership. Unlike
        Gross Rental Yield, which considers only the rental income in relation
        to the property's cost, Net Rental Yield provides a more realistic
        picture by deducting certain expenses from the income.
      </Typography>
      <Box sx={{ my: 2 }}>
        <MathJax hideUntilTypeset={"first"}>
          {`\\[NetRentalYield =\\left(\\frac{AnnualRent - 1MonthRent - RunningCosts}{PurchasePrice + OneTimeCosts}\\right)*100%\\]`}
        </MathJax>
      </Box>

      <Typography variant="body1">Suggested values:</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        * Running costs = 10% * annualRent
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        * One time costs (Mortgage arrangement fee / Solicitor's cost /
        Maintenance) = ~5000
      </Typography>

      <Box sx={{ display: "flex", gap: "20px", mt: 4 }}>
        <Box>
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
        </Box>
        <Box>
          <Input
            name="runningCosts"
            label="Running costs:"
            type="number"
            value={runningCosts}
            setValue={setRunningCosts}
          />
          <Input
            name="oneTimeCosts"
            label="One time costs:"
            type="number"
            value={oneTimeCosts}
            setValue={setOneTimeCosts}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ml: 2 }}>
          <Typography variant="body2">Net Rental Yield</Typography>
          <Typography variant="h4">{netRentalYield}%</Typography>
        </Box>
      </Box>
    </div>
  );
};
