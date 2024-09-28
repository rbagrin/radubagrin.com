import React from "react";
import { MyDrawer } from "../../../../../components/MyDrawer";
import { Box, Divider } from "@mui/material";
import { ScreenerStockData } from "../../screener.types";
import Typography from "@mui/material/Typography";
import { LoaderCircular } from "../../../../../util/components/loader-circular.component";

export const ScreenerIncomeStatementDrawer = ({
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
    <MyDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Income statement" width="medium" afterClose={afterClose}>
      {stock ? (
        <Box>
          <Typography>{stock.name}</Typography>

          <Divider />

          <Typography>Revenue & Growth</Typography>
          <Divider />

          <Typography>Gross Income & Margin</Typography>
          <Divider />

          <Typography>Net income & Margin</Typography>
        </Box>
      ) : (
        <LoaderCircular />
      )}
    </MyDrawer>
  );
};
