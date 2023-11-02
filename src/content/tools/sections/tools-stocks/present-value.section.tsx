import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Input } from "../../../../components/forms/Input";
import React, { useMemo, useState } from "react";
import { round } from "../../../../util/number.util";
import { Card, CardContent, CardHeader } from "@mui/material";

export const PresentValueSection = () => {
  const [futureValue, setFutureValue] = useState<number | "">(10000);
  const [rateOfReturn, setRateOfReturn] = useState<number | "">(5);
  const [numberOfPeriods, setNumberOfPeriods] = useState<number | "">(10);

  const presentValue = useMemo(
    () =>
      round(
        Number(futureValue) /
          (1 + Number(rateOfReturn) / 100) ** Number(numberOfPeriods),
        2
      ),
    [futureValue, rateOfReturn, numberOfPeriods]
  );

  return (
    <Card>
      <CardHeader title="Present value (PV)" />
      <CardContent>
        <Typography variant="body1">
          <a
            href="https://www.investopedia.com/terms/p/presentvalue.asp"
            target="_blank"
            rel="noreferrer"
          >
            Present value
          </a>{" "}
          is the current value of a future sum of money or stream of cash flows
          given a specified rate of return.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "end", mt: 2 }}>
          <Input
            label="Future value:"
            name="futureValue"
            value={futureValue}
            setValue={setFutureValue}
          />
          <Input
            label="Rate of return:"
            name="rateOfReturn"
            value={rateOfReturn}
            setValue={setRateOfReturn}
          />
          <Input
            label="Number of periods:"
            name="numberOfPeriods"
            value={numberOfPeriods}
            setValue={setNumberOfPeriods}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Present value:</Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              ${presentValue}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
