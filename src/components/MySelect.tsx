import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React from "react";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import { styled } from "@mui/material/styles";

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

export const StyledSelect = styled(Select)<SelectProps>(({ theme }) => ({
  "& .MuiInputBase-input": {
    backgroundColor: theme.palette.mode === "dark" ? "#666" : "#fff",
    "&:hover, &.Mui-focusVisible": {
      backgroundColor: theme.palette.mode === "dark" ? "#666" : "#fff",
    },
  },
}));

export const MySelect = ({
  label,
  value,
  onChange,
  options,
  required = false,
  fullWidth = false,
  disabled = false,
}: MySelectProps) => (
  <FormControl variant="filled">
    <InputLabel id="select-label" variant="filled">
      {label}
    </InputLabel>
    <StyledSelect
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
    </StyledSelect>
  </FormControl>
);
