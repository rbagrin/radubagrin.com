import React, { useMemo, useState } from "react";
import { round } from "../../../../util/number.util";
import { Input } from "../../../../components/forms/Input";
import { Box, Typography } from "@mui/material";

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
      <h3>Net Rental Yield</h3>
      <code>
        NetRentalYield = ((annualRent - 1monthRent - runningCosts) /
        (purchasePrice + oneTimeCosts)) * 100%
      </code>

      <p>Suggested values:</p>
      <ul>
        <li>Running costs = 10% * annualRent</li>
        <li>
          One time costs (Mortgage arrangement fee / Solicitor's cost /
          Maintenance) = ~5000
        </li>
      </ul>

      <Box style={{ display: "flex", gap: "20px" }}>
        <div>
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
        </div>
        <div>
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
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ml: 2 }}>
          <Typography variant="body2">Net Rental Yield</Typography>
          <Typography variant="h4">{netRentalYield}%</Typography>
        </Box>
      </Box>
    </div>
  );
};
