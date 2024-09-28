import { Box, CircularProgress } from "@mui/material";
import React from "react";

export const LoaderCircular = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%" }}
    >
      <CircularProgress />
    </Box>
  );
};
