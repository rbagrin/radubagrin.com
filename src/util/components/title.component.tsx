import Typography from "@mui/material/Typography";
import React from "react";

export const Title = ({ children }: { children: string }) => (
  <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: "bold" }}>
    {children}
  </Typography>
);
