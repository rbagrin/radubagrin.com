import React, { useCallback, useState } from "react";
import { DBStock, Ticker } from "../../types/stock.type";
import { Box, Button, Typography } from "@mui/material";
import { StockAPI } from "../../api/stock.api";
import { MyDrawer } from "../../components/MyDrawer";
import { MyInput } from "../../components/MyInput";
import IconButton from "@mui/material/IconButton";
import { iconSize } from "../../css-style/style";
import { ReactComponent as CloseCircle } from "../../icons/close-circle.svg";

export const EditStocksDrawer = ({
  isOpen,
  setIsOpen,
  stocks,
  refresh,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => Promise<void>;
  stocks: DBStock[];
}) => {
  const [ticker, setTicker] = useState<string>("");
  const [name, setName] = useState<string>("");

  const deleteStock = useCallback(
    async (id: string) => {
      try {
        await StockAPI.deleteDBStocks(id);

        await refresh();
      } catch (e) {
        console.error(e);
      }
    },
    [refresh]
  );

  const addStock = useCallback(
    async (ticker: Ticker, name: string) => {
      if (stocks.find((s) => s.ticker === ticker)) {
        alert("This stock is already in your list.");
        return;
      }

      if (!name || !ticker) {
        alert("Please input a name and a ticker.");
        return;
      }
      try {
        await StockAPI.addDBStocks(ticker, name);
        await refresh();
      } catch (e) {
        console.error(e);
      }
    },
    [stocks, refresh]
  );

  return (
    <MyDrawer isOpen={isOpen} setIsOpen={setIsOpen} title="Stocks list">
      <Typography variant="subtitle1">Add new stock</Typography>
      <Box
        sx={{
          mt: 1,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box sx={{ display: "flex", gap: "5px" }}>
          <MyInput
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            label="Ticker"
          />
          <MyInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={async () => {
              await addStock(ticker, name);
            }}
            disabled={!ticker || !name}
          >
            <Typography variant="h6" color="white">
              Add
            </Typography>
          </Button>
        </Box>
      </Box>

      <Box sx={{ overflowY: "auto" }}>
        {stocks.map((s) => (
          <Box
            key={s._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderRadius: "5px",
              alignItems: "center",
              gap: "10px",
              px: "10px",
              py: "2px",
              ":hover": { bgcolor: "#aaa" },
            }}
          >
            <Typography variant="body1">{s.name}</Typography>
            <Box>
              <IconButton
                onClick={async () => {
                  await deleteStock(s._id);
                }}
                color="error"
              >
                <CloseCircle {...iconSize} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </MyDrawer>
  );
};
