import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ChamberType } from "../types/fibre-network.types";

interface ComponentProps {
  readonly rows: ChamberType[];
}
export const ChambersTable = ({ rows }: ComponentProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Latitude</TableCell>
            <TableCell align="right">Longitude</TableCell>
            <TableCell align="right">Total capacity</TableCell>
            <TableCell align="right">Used capacity</TableCell>
            <TableCell align="right">Created at</TableCell>
            <TableCell align="right">Updated at</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                bgcolor:
                  row.totalCapacity - row.usedCapacity <= 0
                    ? "#e68791"
                    : row.totalCapacity - row.usedCapacity < 10
                    ? "#f5c1c6"
                    : "white",
              }}
            >
              <TableCell align="right">{row.id}</TableCell>
              <TableCell component="th" scope="row">
                {row.latitude}
              </TableCell>
              <TableCell align="right">{row.longitude}</TableCell>
              <TableCell align="right">{row.totalCapacity}</TableCell>
              <TableCell align="right">{row.usedCapacity}</TableCell>
              <TableCell align="right">
                {new Date(row.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell align="right">
                {new Date(row.updatedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
