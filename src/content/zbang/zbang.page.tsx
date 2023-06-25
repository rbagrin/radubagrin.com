import React, { useCallback, useEffect, useMemo, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { iconSize } from "../../css-style/style";
import { ReactComponent as Pen } from "../../icons/pen.svg";
import { ReactComponent as FinishFlag } from "../../icons/flag-checkered.svg";
import { ReactComponent as Plus } from "../../icons/plus.svg";
import { Button } from "../../components/Button";
import { AddEntryModal } from "./components/add-entry-modal.component";
import { EntryI, ModelI } from "./zbang.interface";
import { DB } from "./db/db.index";

function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


const getModelById = (allModels: ModelI[], id: number) => {
  return allModels.find((model) => model.id === id);
};

const getPriceByTotalTime = (time: number, model: ModelI): number => {
  if (time <= 15) return model.priceModel["level1"];
  if (time <= 30) return model.priceModel["level2"];
  if (time <= 60) return model.priceModel["level3"];
  if (time <= 120) return model.priceModel["level3"];

  return (
    model.priceModel["level4"] +
    (time - 120) * model.priceModel["extraPerMinute"]
  );
};

const getRowTime = (row: EntryI): number => {
  return row.start && row.finish
    ? Math.round(
        (new Date(row.finish).getTime() - new Date(row.start).getTime()) / 60000
      )
    : 0;
};

const getRowPrice = (row: EntryI, model: ModelI): number => {
  const timeInMinutes = getRowTime(row);
  return timeInMinutes > 0 && model
    ? getPriceByTotalTime(timeInMinutes, model)
    : 0;
};

export const ZbangPage = () => {
  const [tableEntries, setTableEntries] = useState<EntryI[]>([]);
  const [allModels, setAllModels] = useState([]);

  const refreshModels = useCallback(async () => {
    try {
      const models = await DB.ModelRepo.findAllModels();
      setAllModels(models ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshEntries = useCallback(async () => {
    try {
      const entries = await DB.EntryRepo.findAllEntries();
      setTableEntries(entries ?? []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    Promise.all([refreshModels(), refreshEntries()]);
  }, [refreshModels, refreshEntries]);

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <EntriesTable
        allModels={allModels}
        tableEntries={tableEntries}
        refreshEntries={refreshEntries}
      />
    </Box>
  );
};

const bgColorStyle = { color: "white", bgcolor: grey[900] };
const EntriesTable = ({
  allModels,
  tableEntries,
  refreshEntries,
}: {
  allModels: ModelI[];
  tableEntries: EntryI[];
  refreshEntries: () => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<EntryI | null>(null);

  const finishEntry = useCallback(
    async (entry: EntryI) => {
      if (entry.finish) return;

      try {
        const finish = new Date();
        finish.setMinutes(finish.getMinutes() + getRandomIntInclusive(10, 145));

        await DB.EntryRepo.updateEntryById(entry.id, { finish, consent: true });
        await refreshEntries();
      } catch (error) {
        console.error();
      }
    },
    [refreshEntries]
  );

  const totalPrice = useMemo(
    () =>
      tableEntries.reduce((total, row) => {
        const model = getModelById(allModels, row.modelId);
        if (!model) return total;

        const modelPrice = getRowPrice(row, model);
        total += modelPrice;
        return total;
      }, 0),
    [tableEntries, allModels]
  );

  return (
    <>
      {isOpen && (
        <AddEntryModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          allModels={allModels}
          entry={selectedRow}
          refreshEntries={refreshEntries}
          onClose={() => {
            setSelectedRow(null);
          }}
        />
      )}

      <TableContainer component={Paper}>
        <Table sx={{ ...bgColorStyle }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell key="model" sx={bgColorStyle}>
                Model / Numar
              </TableCell>
              <TableCell key="start" sx={bgColorStyle}>
                Start
              </TableCell>
              <TableCell key="finish" sx={bgColorStyle}>
                Finish
              </TableCell>
              <TableCell key="time" sx={bgColorStyle}>
                Timp (minute)
              </TableCell>
              <TableCell key="price" sx={bgColorStyle}>
                Pret
              </TableCell>
              <TableCell key="fullName" sx={bgColorStyle}>
                Nume / Prenume
              </TableCell>
              <TableCell key="phone" sx={bgColorStyle}>
                Telefon
              </TableCell>
              <TableCell key="consent" sx={bgColorStyle}>
                Am luat la cunostinta
              </TableCell>
              <TableCell
                key="actions"
                sx={{ width: "50px", ...bgColorStyle }}
                align="center"
              >
                <Button
                  sx={{ width: "40px" }}
                  variant="contained"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <Plus {...iconSize} />
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableEntries.map((row, index) => {
              const model = getModelById(allModels, row.modelId);
              const time = getRowTime(row);
              const price = model && time > 0 ? getRowPrice(row, model) : 0;
              return (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell
                    key="model"
                    sx={bgColorStyle}
                    component="th"
                    scope="row"
                  >
                    {model?.name ?? "N/A"}
                  </TableCell>
                  <TableCell key="start" sx={bgColorStyle} align="right">
                    {row.start
                      ? row.start.toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                          hourCycle: "h23",
                        })
                      : ""}
                  </TableCell>
                  <TableCell key="finish" sx={bgColorStyle} align="right">
                    {row.finish
                      ? row.finish.toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                          hourCycle: "h23",
                        })
                      : ""}
                  </TableCell>
                  <TableCell key="time" sx={bgColorStyle} align="right">
                    {time > 0 ? `${time} minute` : "In progres"}
                  </TableCell>
                  <TableCell key="price" sx={bgColorStyle} align="right">
                    {price > 0 ? `${price} LEI` : "-"}
                  </TableCell>
                  <TableCell key="fullName" sx={bgColorStyle} align="right">
                    {row.fullName}
                  </TableCell>
                  <TableCell key="phoneNo" sx={bgColorStyle} align="right">
                    {row.phoneNo}
                  </TableCell>
                  <TableCell key="consent" sx={bgColorStyle} align="right">
                    {row.consent ? "Ilie Baraghin" : ""}
                  </TableCell>
                  <TableCell key="actions" sx={bgColorStyle} align="right">
                    <Box sx={{ display: "flex", gap: "15px" }}>
                      {!row.finish && (
                        <Box sx={{ width: "16px" }}>
                          <IconButton
                            onClick={() => {
                              setSelectedRow(row);
                              setIsOpen(true);
                            }}
                            sx={{ color: "blue" }}
                          >
                            <Pen {...iconSize} />
                          </IconButton>
                        </Box>
                      )}

                      {!row.finish && (
                        <Box sx={{ width: "16px" }}>
                          <IconButton
                            onClick={async () => {
                              await finishEntry(row);
                            }}
                            sx={{ color: "green" }}
                          >
                            <FinishFlag {...iconSize} />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow
              key="total"
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell
                key="total"
                sx={bgColorStyle}
                component="th"
                scope="row"
              >
                Total
              </TableCell>
              <TableCell
                key="empty1"
                sx={bgColorStyle}
                component="th"
                scope="row"
              />

              <TableCell
                key="empty2"
                sx={bgColorStyle}
                component="th"
                scope="row"
              />
              <TableCell
                key="empty3"
                sx={bgColorStyle}
                component="th"
                scope="row"
              />

              <TableCell
                key="totalPrice"
                sx={bgColorStyle}
                component="th"
                scope="row"
              >
                {totalPrice > 0 ? `${totalPrice} LEI` : "-"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
