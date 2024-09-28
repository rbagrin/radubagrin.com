import React, { ReactNode } from "react";
import { Box, Container } from "@mui/material";
import { Breakpoint } from "@mui/system";

export const Content = ({
  className = "",
  children,
  maxWidth = "md",
}: {
  className?: string;
  children: ReactNode;
  maxWidth?: Breakpoint | false;
}) => (
  <Container
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
    maxWidth={maxWidth}
    className={className}
  >
    <Box sx={{ width: "100%" }}>{children}</Box>
  </Container>
);
