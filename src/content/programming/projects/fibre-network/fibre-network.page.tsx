import { Box } from "@mui/material";
import React from "react";
import { Monospace } from "../../../../components/monospace";
import { Route, Routes } from "react-router-dom";
import {
  FIBRE_NETWORK_CHAMBERS_ROUTE,
  FIBRE_NETWORK_CUSTOMERS_ROUTE,
  FIBRE_NETWORK_HOME_ROUTE,
} from "./fibre-network.routes";
import { FibreNetworkHomePage } from "./pages/fibre-network-home.page";

export const FibreNetworkPage = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Monospace>Fibre network project here</Monospace>
      <Routes>
        <Route
          // path={handleRouterPath(FIBRE_NETWORK_HOME_ROUTE)}
          path={FIBRE_NETWORK_HOME_ROUTE}
          Component={FibreNetworkHomePage}
        />
        <Route
          // path={handleRouterPath(FIBRE_NETWORK_HOME_ROUTE)}
          path={FIBRE_NETWORK_CUSTOMERS_ROUTE}
          Component={FibreNetworkHomePage}
        />
        <Route
          // path={handleRouterPath(FIBRE_NETWORK_HOME_ROUTE)}
          path={FIBRE_NETWORK_CHAMBERS_ROUTE}
          Component={FibreNetworkHomePage}
        />
      </Routes>
    </Box>
  );
};
