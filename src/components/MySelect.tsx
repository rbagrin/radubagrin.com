import { InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { SelectInputProps } from "@mui/material/Select/SelectInput";

interface SelectOption {
  readonly name: string;
  readonly value: string | number | null;
}

interface MySelectProps {
  readonly label: string;
  readonly value: string | number | null;
  readonly onChange: SelectInputProps["onChange"];
  readonly options: SelectOption[];
  readonly required?: boolean;
  readonly fullWidth?: boolean;
  readonly disabled?: boolean;
}
export const MySelect = ({
  label,
  value,
  onChange,
  options,
  required = false,
  fullWidth = false,
  disabled = false,
}: MySelectProps) => (
  <>
    <InputLabel id="select-label">{label}</InputLabel>
    <Select
      variant="filled"
      labelId="select-label"
      value={value}
      onChange={onChange}
      required={required}
      fullWidth={fullWidth}
      disabled={disabled}
    >
      {options.map((o) => (
        <MenuItem value={o.value}>{o.name}</MenuItem>
      ))}
    </Select>
  </>
);
