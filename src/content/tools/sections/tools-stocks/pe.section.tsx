import Box from "@mui/material/Box";
import { Input } from "../../../../components/forms/Input";
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { round } from "../../../../util/number.util";

let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const PESection = () => {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [currentRatio, setCurrentRatio] = useState<number>(0);

  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [targetRatio, setTargetRatio] = useState<number>(0);

  const earnings = currentRatio <= 0 ? 0 : currentPrice / currentRatio;

  const targetPriceResult = useMemo(
    () => earnings * targetRatio,
    [earnings, targetRatio]
  );

  const targetRatioResult = useMemo(
    () => (earnings > 0 ? targetPrice / earnings : 0),
    [earnings, targetPrice]
  );

  return (
    <Card>
      <CardHeader title="Target 'Price to' Ratio calculator" />
      <CardContent>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Given the current stock price and valuation ratio, you can either set
          a target ratio to determine the price at which it would reach that
          ratio, or set a target price to calculate the corresponding valuation
          ratio
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Input
              label="Current price"
              name="currentPrice"
              type="number"
              value={currentPrice}
              setValue={setCurrentPrice}
            />
            <Input
              label="Current Ratio (P/X)"
              name="currentRatio"
              type="number"
              value={currentRatio}
              setValue={setCurrentRatio}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}
            >
              <Input
                label="Target Ratio"
                name="targetRatio"
                type="number"
                value={targetRatio}
                setValue={setTargetRatio}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "130px",
                }}
              >
                <Typography variant="body2">Price at target ratio</Typography>
                <Typography variant="h6">
                  {USDollar.format(targetPriceResult)}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}
            >
              <Input
                label="Target Price"
                name="targetPrice"
                type="number"
                value={targetPrice}
                setValue={setTargetPrice}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "130px",
                }}
              >
                <Typography variant="body2">Ratio at target price</Typography>
                <Typography variant="h6">
                  {round(targetRatioResult, 1)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
