import React from "react";
import { MyDrawer } from "../../../../../components/MyDrawer";
import { Box, Divider } from "@mui/material";
import { ScreenerStockData } from "../../screener.types";
import Typography from "@mui/material/Typography";
import { LoaderCircular } from "../../../../../util/components/loader-circular.component";

export const ScreenerCashFlowDrawer = ({
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
    <MyDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Cash Flow" width="medium" afterClose={afterClose}>
      {stock ? (
        <Box>
          <Typography>{stock.name}</Typography>
          <Divider />
          <Typography>CFO: Cash From Operating Activities</Typography>
          <Divider />
          <Typography>FCF: Free Cash Flow</Typography>
          <Divider />
          <Typography>Net Issuance of Stock</Typography>
          <Typography>CAPEX - growth - but aligned with CFO</Typography>
        </Box>
      ) : (
        <LoaderCircular />
      )}
    </MyDrawer>
  );
};
