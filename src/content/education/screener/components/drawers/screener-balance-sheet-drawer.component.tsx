import React from "react";
import { MyDrawer } from "../../../../../components/MyDrawer";
import { Box, Divider } from "@mui/material";
import { ScreenerStockData } from "../../screener.types";
import Typography from "@mui/material/Typography";
import { LoaderCircular } from "../../../../../util/components/loader-circular.component";

export const ScreenerBalanceSheetDrawer = ({
  isOpen,
  setIsOpen,
  afterClose,
  stock,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stock: ScreenerStockData | null;
  afterClose?: () => void;
}) => {
  return (
    <MyDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Balance Sheet" width="medium" afterClose={afterClose}>
      {stock ? (
        <Box>
          <Typography>{stock.name}</Typography>
          <Divider />
          <Typography>Assets</Typography>
          <Typography>Liabilities</Typography>
          <Typography>Ratio</Typography>
          <Divider />
          <Typography>Current Assets</Typography>
          <Typography>Cash</Typography>
          <Typography>Current Liabilities</Typography>
          <Typography>Current Ratio and Quick Ratio</Typography>
          <Divider />
          <Typography>Debt</Typography>
          <Typography>Equity</Typography>
          <Typography>Debt to Equity</Typography>
          <Divider />
          <Typography>Shareholders' Equity and Retained Earnings</Typography>
        </Box>
      ) : (
        <LoaderCircular />
      )}
    </MyDrawer>
  );
};
