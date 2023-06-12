import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { MODELS, TableRowI } from "../zbang.page";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { FormControl } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function AddEditModal({
  isOpen,
  setIsOpen,
  row,
  setData,
  onClose,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: TableRowI;
  setData: React.Dispatch<React.SetStateAction<TableRowI[]>>;
  onClose?: () => void;
}) {
  const [model, setModel] = useState<number>(row?.modelId ?? MODELS[0].id);
  const [fullName, setFullName] = useState(row?.fullName ?? "");
  const [phone, setPhone] = useState(row?.phoneNo ?? "");

  const [startH, setStartH] = useState<number>(
    (row?.start ?? new Date()).getHours()
  );
  const [startM, setStartM] = useState<number>(
    (row?.start ?? new Date()).getMinutes()
  );

  const [endH, setEndH] = useState<number | "">(row?.finish?.getHours() ?? "");
  const [endM, setEndM] = useState<number | "">(
    row?.finish?.getMinutes() ?? ""
  );

  const updateRow = (row: TableRowI) => {
    setData((prev) =>
      prev.map((r) => {
        if (r.id !== row.id) return r;

        const start = new Date();
        start.setHours(startH);
        start.setMinutes(startM);

        let finish: Date | null = null;
        if (endH !== "" && endM !== "") {
          finish = new Date();
          finish.setHours(endH);
          finish.setMinutes(endM);
        }

        return {
          ...row,
          modelId: model,
          fullName,
          phoneNo: phone,
          start,
          finish,
        };
      })
    );
  };
  const createRow = () => {
    const start = new Date();
    start.setHours(startH);
    start.setMinutes(startM);

    setData((prev) => {
      const previousIds = prev.map((r) => r.id);
      return [
        ...prev,
        {
          id: Math.max(...previousIds) + 1,
          modelId: model,
          start,
          finish: null,
          fullName,
          phoneNo: phone,
          price: 0,
          consent: false,
        },
      ];
    });
  };
  const saveRow = () => {
    if (row) updateRow(row);
    else createRow();
  };

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          if (onClose) onClose();
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {row ? "Edit" : "Adauga"}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <InputLabel>Model</InputLabel>
            <FormControl fullWidth>
              <Select
                value={model}
                onChange={(event) => {
                  setModel(Number(event.target.value));
                }}
              >
                {MODELS.map((model) => (
                  <MenuItem value={model.id}>{model.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <InputLabel>Start</InputLabel>
            <Box sx={{ display: "flex" }}>
              <TextField
                required
                value={startH}
                onChange={(e) => setStartH(Number(e.target.value))}
              />
              <TextField
                required
                value={startM}
                onChange={(e) => setStartM(Number(e.target.value))}
              />
            </Box>

            {row && (
              <Box>
                <InputLabel>Finish</InputLabel>
                <Box sx={{ display: "flex" }}>
                  <TextField
                    required
                    value={endH}
                    onChange={(e) =>
                      setEndH(e.target.value ? Number(e.target.value) : "")
                    }
                  />
                  <TextField
                    required
                    value={endM}
                    onChange={(e) =>
                      setEndM(e.target.value ? Number(e.target.value) : "")
                    }
                  />
                </Box>
              </Box>
            )}

            <InputLabel>Nume / Prenume</InputLabel>
            <TextField
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
            />

            <InputLabel>Telefon</InputLabel>
            <TextField
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Button variant="contained" size="large" onClick={saveRow}>
              {row ? "Update" : "Adauga"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
