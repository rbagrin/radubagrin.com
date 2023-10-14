import Modal from "@mui/material/Modal";
import React, { useCallback, useState } from "react";
import { DBStock, Ticker } from "../../types/stock.type";
import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import { StockAPI } from "../../api/stock.api";

export const EditStocksModal = ({
  isOpen,
  setIsOpen,
  onClose,
  stocks,
  refresh,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => Promise<void>;
  onClose?: () => void;
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
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        if (onClose) onClose();
      }}
    >
      <Box
        sx={{
          width: "600px",
          height: "800px",
          mx: "auto",
          bgcolor: "#444",
          mt: "200px",
          overflowY: "auto",
        }}
      >
        <Box sx={{ p: "20px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: "10px",
              gap: "10px",
            }}
          >
            <Typography variant="h6" color="black">
              Stocks
            </Typography>

            <Box sx={{ display: "flex", gap: "5px", ml: "10px" }}>
              <TextField
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                size="small"
                label="Ticker"
              />

              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="small"
                label="Name"
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={async () => {
                  await addStock(ticker, name);
                }}
              >
                <Typography variant="h4" color="black">
                  +
                </Typography>
              </Button>
            </Box>
          </Box>
          {stocks.map((s) => (
            <Box
              key={s._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                px: "10px",
                py: "2px",
                ":hover": { bgcolor: "#aaa" },
              }}
            >
              <Typography color="black">{s.name}</Typography>
              <Box>
                <Button
                  onClick={async () => {
                    await deleteStock(s._id);
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};
