import React, { useMemo, useState } from "react";
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
import { ReactComponent as Plus } from "../../icons/plus.svg";
import { Button } from "../../components/Button";
import { AddEditModal } from "./components/add-edit-modal.component";

export interface ModelI {
  id: number;
  name: string;
  price: number;
}

export const MODELS: ModelI[] = [
  { id: 1, name: "ATV", price: 2 },
  { id: 2, name: "Politie", price: 1 },
  { id: 3, name: "Tractor", price: 1 },
  { id: 4, name: "Extra", price: 1.5 },
];
export interface TableRowI {
  id: number;
  modelId: number;
  start: Date | null;
  finish: Date | null;
  fullName: string;
  phoneNo: string;
  consent: boolean | null;
}
const hardcodedData: TableRowI[] = [
  createData(
    1,
    1,
    new Date(2023, 5, 12, 12, 25),
    new Date(2023, 5, 12, 12, 40),
    "Popescu Ion",
    "07312341332",
    true
  ),
  createData(
    2,
    2,
    new Date(2023, 5, 12, 13, 0),
    new Date(2023, 5, 12, 14, 0),
    "Ilie Baraghin",
    "068907643",
    true
  ),
];

function createData(
  id: number,
  modelId: number,
  start: Date,
  finish: Date,
  fullName: string,
  phoneNo: string,
  consent: boolean
): TableRowI {
  return {
    id,
    modelId,
    start,
    finish,
    fullName,
    phoneNo,
    consent,
  };
}

const rows = [...hardcodedData];
export const ZbangPage = () => {
  const [data, setData] = useState<TableRowI[]>([...rows]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TableRowI | null>(null);

  const totalPrice = useMemo(
    () =>
      data.reduce((total, row) => {
        const modelPrice = MODELS.find((m) => m.id === row.id)?.price ?? 0;
        const timeInMinutes =
          row.start && row.finish
            ? (new Date(row.finish).getTime() - new Date(row.start).getTime()) /
              60000
            : 0;
        total += modelPrice * timeInMinutes;
        return total;
      }, 0),
    [data]
  );

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <BasicTable
        rows={data}
        onEdit={(row: TableRowI) => {
          setSelectedRow(row);
          setIsOpen(true);
        }}
        openAddModal={() => {
          setSelectedRow(null);
          setIsOpen(true);
        }}
        totalPrice={totalPrice}
      />
      {isOpen && (
        <AddEditModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          row={selectedRow}
          onClose={() => {
            setSelectedRow(null);
          }}
          setData={setData}
        />
      )}
    </Box>
  );
};

const bgColorStyle = { color: "white", bgcolor: grey[900] };
const BasicTable = ({
  rows,
  onEdit,
  openAddModal,
  totalPrice,
}: {
  rows: TableRowI[];
  onEdit: (row: TableRowI) => void;
  openAddModal: () => void;
  totalPrice: number;
}) => {
  return (
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
                onClick={openAddModal}
              >
                <Plus {...iconSize} />
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            const model = MODELS.find((m) => m.id === row.id);
            const time =
              row?.start && row?.finish
                ? Math.round(
                    (new Date(row.finish).getTime() -
                      new Date(row.start).getTime()) /
                      60000
                  )
                : 0;
            const price = model ? model.price * time : 0;
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
                  {model ? `${model?.name} (${model.price} lei / min)` : "N/A"}
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
                  {time} minute
                </TableCell>
                <TableCell key="price" sx={bgColorStyle} align="right">
                  {price} LEI
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
                  <Box>
                    <Box sx={{ width: "16px" }}>
                      <IconButton
                        onClick={() => {
                          onEdit(row);
                        }}
                      >
                        <Pen {...iconSize} />
                      </IconButton>
                    </Box>
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
            <TableCell key="total" sx={bgColorStyle} component="th" scope="row">
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
              {totalPrice} LEI
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
