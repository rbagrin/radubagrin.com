import React, { ReactNode } from "react";
import { Box, Container } from "@mui/material";

export const Content = ({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <Container
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
    maxWidth="md"
    className={className}
  >
    <Box sx={{ width: "100%" }}>{children}</Box>
  </Container>
);
