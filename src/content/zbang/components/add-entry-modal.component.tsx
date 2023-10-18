import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { FormControl } from "@mui/material";
import { EntryI, ModelI } from "../zbang.interface";
import { DB } from "../db/db.index";
import { MyInput } from "../../../components/MyInput";
import { MySelect } from "../../../components/MySelect";

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

export function AddEntryModal({
  isOpen,
  setIsOpen,
  entry,
  allModels,
  refreshEntries,
  onClose,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  entry?: EntryI;
  allModels: ModelI[];
  refreshEntries: () => Promise<void>;
  onClose?: () => void;
}) {
  const [modelId, setModelId] = useState<number>(
    entry?.modelId ?? allModels[0].id
  );
  const [fullName, setFullName] = useState(entry?.fullName ?? "");
  const [phone, setPhone] = useState(entry?.phoneNo ?? "");

  const updateRow = async (entry: EntryI) => {
    await DB.EntryRepo.updateEntryById(entry.id, {
      ...entry,
      fullName,
      phoneNo: phone,
    });
  };

  const createRow = async () => {
    const start = new Date();
    await DB.EntryRepo.addEntry({
      modelId: modelId,
      start,
      finish: null,
      fullName,
      phoneNo: phone,
      consent: false,
    });
  };

  const saveRow = async () => {
    try {
      if (entry) await updateRow(entry);
      else await createRow();

      await refreshEntries();

      onClose();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        if (onClose) onClose();
      }}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {entry ? "Edit" : "Adauga"}
        </Typography>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControl fullWidth>
            <MySelect
              label="Model"
              value={modelId}
              onChange={(event) => {
                setModelId(Number(event.target.value));
              }}
              options={allModels.map((m) => ({ name: m.name, value: m.id }))}
            />
          </FormControl>

          <MyInput
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            label="Nume"
          />

          <MyInput
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            label="Telefon"
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button variant="contained" size="large" onClick={saveRow}>
            {entry ? "Update" : "Adauga"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
