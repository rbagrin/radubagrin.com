import { Box, Typography } from "@mui/material";
import { PeriodListingItem } from "./period-listing-item.component";
import React, { useContext } from "react";
import { round } from "../../../../util/number.util";
import { ISODate } from "../../../../types/stock.type";
import { GlobalState } from "../../../../util/global-state/global-state";

const calculateDifferencePercentage = (
  current: number | null | undefined,
  previous: number | null | undefined
): number => {
  // TODO: check this logic - does it make sense to have percentages for negative values??
  if (!current) return 0;
  if (!previous) return 100;

  // if both values are positive or both values are negative
  if ((current < 0 && previous < 0) || (current > 0 && previous > 0))
    return round((current / previous) * 100 - 100, 2) * (current < 0 ? -1 : 1);

  // if one value is positive and one value is negative
  return current > 0 ? 100 : -100;
};

const isDefined = (value: unknown) => value !== undefined;

const EmptyCell = () => <Box sx={{ width: "20%", minWidth: "100px" }}>-</Box>;

interface PeriodListingProps {
  readonly title: string;
  readonly value1: number | null | undefined;
  readonly value2: number | null | undefined;
  readonly value3: number | null | undefined;
  readonly value4: number | null | undefined;
  readonly value5: number | null | undefined;
  readonly period1: ISODate;
  readonly period2: ISODate;
  readonly period3: ISODate;
  readonly period4: ISODate;
  readonly period5: ISODate;
  readonly showPercentage?: boolean;
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
  showPercentage = true,
}: PeriodListingProps) => {
  const { state } = useContext(GlobalState);
  const isDarkMode = state.darkMode;

  const difference1to2 = calculateDifferencePercentage(value1, value2);
  const difference2to3 = calculateDifferencePercentage(value2, value3);
  const difference3to4 = calculateDifferencePercentage(value3, value4);
  const difference4to5 = calculateDifferencePercentage(value4, value5);

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
        {isDefined(value5) ? (
          <PeriodListingItem value={value5 ?? 0} period={period5} />
        ) : (
          <EmptyCell />
        )}
        {isDefined(value4) ? (
          <PeriodListingItem
            value={value4 ?? 0}
            period={period4}
            percentageDifference={showPercentage ? difference4to5 : undefined}
          />
        ) : (
          <EmptyCell />
        )}
        {isDefined(value3) ? (
          <PeriodListingItem
            value={value3 ?? 0}
            period={period3}
            percentageDifference={showPercentage ? difference3to4 : undefined}
          />
        ) : (
          <EmptyCell />
        )}
        {isDefined(value2) ? (
          <PeriodListingItem
            value={value2 ?? 0}
            period={period2}
            percentageDifference={showPercentage ? difference2to3 : undefined}
          />
        ) : (
          <EmptyCell />
        )}
        {isDefined(value1) ? (
          <PeriodListingItem
            value={value1 ?? 0}
            period={period1}
            percentageDifference={showPercentage ? difference1to2 : undefined}
            isMostRecent
          />
        ) : (
          <EmptyCell />
        )}
      </Box>
    </Box>
  );
};
