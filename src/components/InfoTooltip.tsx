import { Tooltip } from "@mui/material";
import { iconSize } from "@/css-style/style";
import { Colors } from "@/css-style/colors";
import { ReactComponent as InfoCircle } from "@/icons/info-circle.svg";

import React, { ReactNode } from "react";

interface Props {
  readonly tooltipText: string | ReactNode;
  readonly color?: keyof typeof Colors;
}
export const InfoTooltip = ({ tooltipText, color = "BlueLight" }: Props) => {
  return Boolean(tooltipText) ? (
    <Tooltip title={tooltipText} placement="top" sx={{ cursor: "pointer" }}>
      <InfoCircle {...iconSize} fill={Colors[color] ?? Colors.BlueLight} />
    </Tooltip>
  ) : null;
};
