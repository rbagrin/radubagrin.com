import TextField, { TextFieldProps } from "@mui/material/TextField";
import React, { HTMLInputTypeAttribute } from "react";
import { OutlinedInputProps } from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";

interface InputProps {
  value: string | number;
  onChange: OutlinedInputProps["onChange"];
  size?: "small" | "medium";
  label?: string;
  type?: HTMLInputTypeAttribute;
  variant?: "outlined" | "standard" | "filled";
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export const StyledTextField = styled(TextField)<TextFieldProps>(
  ({ theme }) => ({
    "& .MuiInputBase-input": {
      backgroundColor: theme.palette.mode === "dark" ? "#666" : "#fff",
      "&:hover, &.Mui-focusVisible": {
        backgroundColor: theme.palette.mode === "dark" ? "#666" : "#fff",
      },
    },
    "& label.Mui-focused": {
      color: theme.palette.mode === "dark" ? "#eee" : "#333",
    },
  })
);

export const MyInput = ({
  value,
  onChange,
  label,
  size = "small",
  type = "text",
  variant = "filled",
  fullWidth = false,
  required = false,
  disabled = false,
}: InputProps) => (
  <StyledTextField
    value={value}
    variant={variant}
    onChange={onChange}
    size={size}
    label={label}
    type={type === "number" ? "text" : type}
    inputProps={
      type === "number" ? { inputMode: "numeric", pattern: "[0-9]*" } : {}
    }
    fullWidth={fullWidth}
    required={required}
    disabled={disabled}
  />
);
