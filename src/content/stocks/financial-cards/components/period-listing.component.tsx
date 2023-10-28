import { Box, Typography } from "@mui/material";
import { PeriodListingItem } from "./period-listing-item.component";
import React, { useContext } from "react";
import { round } from "../../../../util/number.util";
import { ISODate } from "../../../../types/stock.type";
import { GlobalState } from "../../../../util/global-state/global-state";

interface PeriodListingProps {
  readonly title: string;
  readonly value1: number;
  readonly value2: number;
  readonly value3: number;
  readonly value4: number;
  readonly value5: number;
  readonly period1: ISODate;
  readonly period2: ISODate;
  readonly period3: ISODate;
  readonly period4: ISODate;
  readonly period5: ISODate;
}

export const PeriodListing = ({
  title,
  value1,
  value2,
  value3,
  value4,
  value5,
  period1,
  period2,
  period3,
  period4,
  period5,
}: PeriodListingProps) => {
  const { state } = useContext(GlobalState);
  const isDarkMode = state.darkMode;

  const difference1to2 = round((value1 / value2) * 100 - 100, 2);
  const difference2to3 = round((value2 / value4) * 100 - 100, 2);
  const difference3to4 = round((value3 / value4) * 100 - 100, 2);
  const difference4to5 = round((value4 / value5) * 100 - 100, 2);

  return (
    <Box
      sx={{
        px: 0.5,
        borderRadius: "5px",
        ":hover": { bgcolor: isDarkMode ? "#444" : "#ddd" },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: isDarkMode ? "#ccc" : "#555",
          mb: "5px",
          fontWeight: "500",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 1,
          justifyContent: "space-between",
        }}
      >
        <PeriodListingItem value={value5} period={period5} />
        <PeriodListingItem
          value={value4}
          period={period4}
          percentageDifference={difference4to5}
        />
        <PeriodListingItem
          value={value3}
          period={period3}
          percentageDifference={difference3to4}
        />
        <PeriodListingItem
          value={value2}
          period={period2}
          percentageDifference={difference2to3}
        />
        <PeriodListingItem
          value={value1}
          period={period1}
          percentageDifference={difference1to2}
          isMostRecent="#aaa"
        />
      </Box>
    </Box>
  );
};
