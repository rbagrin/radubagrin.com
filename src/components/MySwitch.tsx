import { FormControlLabel, Switch } from "@mui/material";
import React, { MouseEventHandler } from "react";

interface Props<T = Element> {
  readonly label?: string;
  readonly checked: boolean;
  readonly onClick?: MouseEventHandler<T> | undefined;
}
export const MySwitch = ({ label, checked, onClick }: Props) => {
  return <FormControlLabel control={<Switch checked={checked} onClick={onClick} />} label={label} />;
};
