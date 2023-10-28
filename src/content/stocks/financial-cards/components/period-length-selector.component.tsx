import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

interface PeriodLengthSelectorProps {
  readonly period: "quarterly" | "annually" | "ttm";
  readonly setPeriod: React.Dispatch<
    React.SetStateAction<"quarterly" | "annually" | "ttm">
  >;
  readonly showTTM?: boolean;
}

export const PeriodLengthSelector = ({
  period,
  setPeriod,
  showTTM = true,
}: PeriodLengthSelectorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod(
      (event.target as HTMLInputElement).value as
        | "quarterly"
        | "annually"
        | "ttm"
    );
  };

  return (
    <FormControl>
      <RadioGroup
        row
        name="period-selector-group"
        value={period}
        onChange={handleChange}
      >
        <FormControlLabel
          value="quarterly"
          control={<Radio size="small" />}
          label="Quarterly"
          sx={{ m: 0, p: 0 }}
        />
        {showTTM && (
          <FormControlLabel
            value="ttm"
            control={<Radio size="small" />}
            label="TTM"
            sx={{ m: 0, p: 0 }}
          />
        )}
        <FormControlLabel
          value="annually"
          control={<Radio size="small" />}
          label="Annually"
          sx={{ m: 0, p: 0 }}
        />
      </RadioGroup>
    </FormControl>
  );
};
