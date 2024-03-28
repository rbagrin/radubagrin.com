import React, { useCallback, useEffect, useState } from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { ChamberType } from "../types/fibre-network.types";
import { ChamberAPI } from "../api/chamber.api";
import { ChambersTable } from "../components/chambers-table.component";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { FIBRE_NETWORK_HOME_ROUTE } from "../fibre-network.routes";
import { ContainerSx } from "../styles/styles";

export const ChambersPage = () => {
  const navigate = useNavigate();
  const [chambers, setChambers] = useState<ChamberType[]>([]);

  const refreshChambers = useCallback(async () => {
    try {
      const chambers = await ChamberAPI.getChambers();
      setChambers(chambers);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    refreshChambers();
  }, [refreshChambers]);

  return (
    <Container sx={ContainerSx}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <IconButton
          aria-label="back"
          color="inherit"
          onClick={() => navigate(FIBRE_NETWORK_HOME_ROUTE)}
          sx={{ color: "grey" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h2" sx={{ fontSize: 36 }}>
          Chambers
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <ChambersTable rows={chambers} />
      </Box>
    </Container>
  );
};
