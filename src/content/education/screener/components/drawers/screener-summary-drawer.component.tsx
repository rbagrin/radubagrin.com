import React from "react";
import { MyDrawer } from "../../../../../components/MyDrawer";
import { Box } from "@mui/material";
import { ScreenerStockData } from "../../screener.types";
import Typography from "@mui/material/Typography";
import { LoaderCircular } from "../../../../../util/components/loader-circular.component";

export const ScreenerSummaryDrawer = ({
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
    <MyDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Summary" width="medium" afterClose={afterClose}>
      {stock ? (
        <Box>
          <Typography>{stock.name}</Typography>
          TODO
        </Box>
      ) : (
        <LoaderCircular />
      )}
    </MyDrawer>
  );
};
