import { Box, Typography } from "@mui/material";
import { shortenNumber } from "../../../../util/number.util";
import React, { useContext } from "react";
import { GlobalState } from "../../../../util/global-state/global-state";

interface PeriodListingProps {
  value: number;
  period: string;
  percentageDifference?: number;
  isMostRecent?: boolean;
}

export const PeriodListingItem = ({
  value,
  period,
  percentageDifference,
  isMostRecent = false,
}: PeriodListingProps) => {
  const { state } = useContext(GlobalState);
  const isDarkMode = state.darkMode;

  return (
    <Box sx={{ width: "20%", minWidth: "100px" }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: isMostRecent ? "900" : "500" }}
        >
          {shortenNumber(value)}
        </Typography>
        {percentageDifference !== undefined && (
          <Typography
            variant="caption"
            sx={{
              color: percentageDifference >= 0 ? "green" : "red",
              fontWeight: isMostRecent ? "900" : "300",
            }}
          >
            {percentageDifference >= 0 ? "+" : ""}
            {percentageDifference}%
          </Typography>
        )}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: isDarkMode ? "#ccc" : "#555",
          fontWeight: isMostRecent ? "900" : "300",
        }}
      >
        {period}
      </Typography>
    </Box>
  );
};
