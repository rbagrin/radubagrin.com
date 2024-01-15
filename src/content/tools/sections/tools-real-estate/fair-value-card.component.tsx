import { Input } from "../../../../components/forms/Input";
import React, { useMemo, useState } from "react";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { MathJax } from "better-react-mathjax";

export const FairValueCard = () => {
  const [monthlyRent, setMonthlyRent] = useState<number | "">(500);
  const fairPrice = useMemo(() => 15 * 12 * Number(monthlyRent), [monthlyRent]);

  return (
    <Card>
      <CardHeader title="Fair value" />
      <CardContent>
        <Typography variant="body1">
          Fair value is represented by the cumulative rental income generated
          over a 15-year period.
        </Typography>
        <Box sx={{ my: 2 }}>
          <MathJax hideUntilTypeset={"first"}>
            {`\\[FairPrice =15Years*MonthlyRent\\]`}
          </MathJax>
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Input
            name="monthlyRent"
            label="Monthly rent:"
            type="number"
            value={monthlyRent}
            setValue={setMonthlyRent}
          />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2">Fair price</Typography>
            <Typography variant="h4">${fairPrice}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
