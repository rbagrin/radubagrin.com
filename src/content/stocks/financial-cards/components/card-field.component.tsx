import { Box, SxProps, Typography } from "@mui/material";
import React, { useContext } from "react";
import { GlobalState } from "../../../../util/global-state/global-state";

interface CardFieldProps {
  l: string;
  v: string | number;
  c?: string;
  sx?: SxProps;
}

export const CardField = ({ l, v, c, sx = {} }: CardFieldProps) => {
  const { state } = useContext(GlobalState);
  const isDarkMode = state.darkMode;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ":hover": {
          bgcolor: isDarkMode ? "#555" : "#eee",
          borderRadius: "5px",
        },
        px: "5px",
        ...sx,
      }}
    >
      <Box sx={{ width: "70%" }}>
        <Typography variant="body2" sx={{ color: c }}>
          {l}
        </Typography>
      </Box>
      <Box sx={{ width: "30%" }}>
        <Typography variant="subtitle2" align="right" sx={{ color: c }}>
          {v}
        </Typography>
      </Box>
    </Box>
  );
};
