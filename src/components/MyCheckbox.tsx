import { Box, Checkbox, FormControlLabel } from "@mui/material";
import React, { ReactNode } from "react";
import { InfoTooltip } from "@/components/InfoTooltip";

interface Props {
  readonly label?: string;
  readonly checked?: boolean;
  readonly onChange?: (checked: boolean) => void;
  readonly tooltipText?: string | ReactNode;
}
export const MyCheckbox = ({ checked, label, onChange, tooltipText }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <FormControlLabel
        style={{ margin: 0, padding: 0 }}
        control={<Checkbox checked={checked} onChange={handleChange} />}
        label={label}
      />

      <InfoTooltip tooltipText={tooltipText} />
    </Box>
  );
};
