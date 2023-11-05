import { Input } from "../../../../components/forms/Input";
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";

export const FairValueCard = () => {
  const [monthlyRent, setMonthlyRent] = useState<number | "">(500);
  const fairPrice = useMemo(() => 15 * 12 * Number(monthlyRent), [monthlyRent]);

  return (
    <Card>
      <CardHeader title="Fair value" />
      <CardContent>
        <code>FairPrice = 15Years * monthlyRent</code>
        <Input
          name="monthlyRent"
          label="Monthly rent:"
          type="number"
          value={monthlyRent}
          setValue={setMonthlyRent}
        />

        <p>Fair price: ${fairPrice}</p>
      </CardContent>
    </Card>
  );
};
