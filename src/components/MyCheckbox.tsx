import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

interface Props {
  readonly label?: string;
  readonly checked?: boolean;
  readonly onChange?: (checked: boolean) => void;
}
export const MyCheckbox = ({ checked, label, onChange }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };
  return <FormControlLabel control={<Checkbox checked={checked} onChange={handleChange} />} label={label} />;
};
