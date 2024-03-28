import React from "react";
import { Box, Card, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CardSx, ContainerSx } from "../styles/styles";
import {
  FIBRE_NETWORK_CHAMBERS_ROUTE,
  FIBRE_NETWORK_CUSTOMERS_ROUTE,
} from "../fibre-network.routes";

export const FibreNetworkHomePage = () => {
  const navigate = useNavigate();
  return (
    <Container sx={ContainerSx}>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <Card
          sx={CardSx}
          onClick={() => {
            navigate(FIBRE_NETWORK_CUSTOMERS_ROUTE);
          }}
        >
          <Typography variant="h5" component="h2">
            Customers
          </Typography>
        </Card>

        <Card
          sx={CardSx}
          onClick={() => {
            navigate(FIBRE_NETWORK_CHAMBERS_ROUTE);
          }}
        >
          <Typography variant="h5" component="h2">
            Chambers
          </Typography>
        </Card>
      </Box>
    </Container>
  );
};
