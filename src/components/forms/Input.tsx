import React from "react";

const SizeOptions = {
  xs: "100px",
  sm: "150px",
  md: "200px",
  lg: "250px",
  xl: "300px",
};

interface InputProps {
  name: string;
  label?: string;
  value: string | number;
  setValue: React.Dispatch<React.SetStateAction<string | number>>;
  type?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const Input = ({
  name,
  label,
  value,
  setValue,
  type = "text",
  size = "md",
}: InputProps) => {
  let inputField;
  switch (type) {
    case "number":
      inputField = (
        <NumberInput name={name} value={value} setValue={setValue} />
      );
      break;
    case "text":
      inputField = (
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          style={{ color: "black" }}
        />
      );
      break;
    default:
      inputField = (
        <input
          id={name}
          name={name}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          style={{ color: "black" }}
        />
      );
  }

  return (
    <div style={{ width: SizeOptions[size] }}>
      {label && <label htmlFor={name}>{label}</label>}
      {inputField}
    </div>
  );
};

const NumberInput = ({
  name,
  value,
  setValue,
}: Pick<InputProps, "name" | "value" | "setValue">) => {
  return (
    <input
      type="number"
      id={name}
      name={name}
      value={value}
      onChange={(e) => {
        const value = Number.parseFloat(e.target.value);
        setValue(isNaN(value) ? "" : value);
      }}
      style={{ color: "black" }}
    />
  );
};
