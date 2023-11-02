import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Input } from "../../../../components/forms/Input";
import React, { useMemo, useState } from "react";
import { round } from "../../../../util/number.util";
import { Card, CardContent, CardHeader } from "@mui/material";

export const CAGRSection = () => {
  const [endingValue, setEndingValue] = useState<number | "">(100);
  const [beginningValue, setBeginningValue] = useState<number | "">(100);
  const [years, setYears] = useState<number | "">(3);

  const cagr = useMemo(() => {
    if (!endingValue || !beginningValue || !years) return 0;

    const result = ((endingValue / beginningValue) ** (1 / years) - 1) * 100;

    return round(result, 2);
  }, [endingValue, beginningValue, years]);

  return (
    <Card>
      <CardHeader title="Compound annual growth rate (CAGR)" />
      <CardContent>
        <Typography variant="body1" sx={{ mt: 2 }}>
          The{" "}
          <a
            href="https://www.investopedia.com/terms/c/cagr.asp"
            target="_blank"
            rel="noreferrer"
          >
            compound annual growth rate
          </a>{" "}
          is the rate of return (RoR) that would be required for an investment
          to grow from its beginning balance to its ending balance, assuming the
          profits were reinvested at the end of each period of the investment’s
          life span.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "end", mt: 2 }}>
          <Input
            label="Ending value"
            name="endingValue"
            value={endingValue}
            setValue={setEndingValue}
          />
          <Input
            label="Beginning value"
            name="beginningValue"
            value={beginningValue}
            setValue={setBeginningValue}
          />
          <Input
            label="No of periods"
            name="years"
            value={years}
            setValue={setYears}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">CAGR:</Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {cagr}%
            </Typography>
          </Box>
        </Box>
      </CardContent>
      {/*  TODO: Add beginning value date picker & ending value date picker, count years between, get price at that moment, then calculate return */}
    </Card>
  );
};
