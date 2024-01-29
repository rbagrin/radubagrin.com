import React from "react";

import { Typography, TypographyProps } from "@mui/material";

interface MonospaceProps extends TypographyProps {
  component?: React.ElementType;
  href?: string | undefined;
  size?: "sm" | "md" | "lg" | "xl";
  children: string;
}

const SizeMap = {
  sm: "0.8rem",
  md: "1rem",
  lg: "1.2rem",
  xl: "1.4rem",
};

export const Monospace = ({
  children,
  component,
  size = "md",
  href,
  ...props
}: MonospaceProps) => {
  return (
    <Typography
      {...props}
      component={component}
      href={href}
      sx={{
        fontFamily: "monospace",
        fontSize: SizeMap[size],
        ...(props.sx ?? {}),
      }}
    >
      {children}
    </Typography>
  );
};
