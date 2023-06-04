import React from "react";
import "./switch.css";

export const Switch = ({
  value,
  updateValue,
}: {
  value: boolean;
  updateValue: () => void;
}) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={value} onChange={() => updateValue()} />
      <span className="slider round"></span>
    </label>
  );
};
