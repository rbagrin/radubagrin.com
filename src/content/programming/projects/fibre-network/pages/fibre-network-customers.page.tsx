import React from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { ContainerSx } from "../styles/styles.ts";
import { CustomersTable } from "../components/customers-table.component.tsx";
import { useCallback, useEffect, useState } from "react";
import { CustomerAPI } from "../api/customer.api.ts";
import { CustomerType } from "../types/customer.type.ts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { FIBRE_NETWORK_HOME_ROUTE } from "../fibre-network.routes";

export const CustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<CustomerType[]>([]);

  const refreshCustomers = useCallback(async () => {
    try {
      const customers = await CustomerAPI.getCustomers();
      setCustomers(customers);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

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
          Customers
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <CustomersTable rows={customers} refresh={refreshCustomers} />
      </Box>
    </Container>
  );
};
