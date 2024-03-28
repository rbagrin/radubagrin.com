import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CustomerType } from "../types/fibre-network.types";
import { NewCustomerDrawer } from "./new-customer-drawer.component";

interface ComponentProps {
  readonly rows: CustomerType[];
  readonly refresh: () => Promise<void>;
}
export const CustomersTable = ({ rows, refresh }: ComponentProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                ID <NewCustomerDrawer refresh={refresh} />
              </Box>
            </TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Postcode</TableCell>
            <TableCell align="right">Latitude</TableCell>
            <TableCell align="right">Longitude</TableCell>
            <TableCell align="right">Chamber ID</TableCell>
            <TableCell align="right">Created at</TableCell>
            <TableCell align="right">Updated at</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.address}</TableCell>
              <TableCell align="right">{row.postcode}</TableCell>
              <TableCell component="th" scope="row">
                {row.latitude}
              </TableCell>
              <TableCell align="right">{row.longitude}</TableCell>
              <TableCell align="right">{row.chamberId ?? "-"}</TableCell>
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
