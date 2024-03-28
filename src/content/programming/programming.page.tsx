import React from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import {
  PROGRAMMING_PROJECT2_ROUTE,
  PROGRAMMING_PROJECT3_ROUTE,
  PROGRAMMING_ROUTE,
} from "../../util/routes";
import { FibreNetworkPage } from "./projects/fibre-network/fibre-network.page";
import { ProjectCard } from "./projects/components/project-card.component";
import { DummyProject } from "./projects/fibre-network/dummy-project.component";
import { FIBRE_NETWORK_HOME_ROUTE } from "./projects/fibre-network/fibre-network.routes";

const handleRouterPath = (path: string): string => {
  return path.split(PROGRAMMING_ROUTE)[1] ?? "/";
};

export const ProgrammingPage = () => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "50px",
          padding: "5px",
          height: "75px",
        }}
      >
        <ProjectCard
          key="fibre-network"
          title="Fibre Network"
          path={FIBRE_NETWORK_HOME_ROUTE}
        />
        <ProjectCard
          key="project2"
          title="Project 2"
          path={PROGRAMMING_PROJECT2_ROUTE}
        />
        <ProjectCard
          key="project-3"
          title="Project 3"
          path={PROGRAMMING_PROJECT3_ROUTE}
        />
      </Box>
      {/*<Box sx={{ bgcolor: "red", padding: 10 }}>*/}
      <Routes>
        <Route
          path={handleRouterPath(FIBRE_NETWORK_HOME_ROUTE)}
          Component={FibreNetworkPage}
        />
        <Route
          path={handleRouterPath(PROGRAMMING_PROJECT2_ROUTE)}
          element={<DummyProject title="Project 2" />}
        />
        <Route
          path={handleRouterPath(PROGRAMMING_PROJECT3_ROUTE)}
          element={<DummyProject title="Project 3" />}
        />
      </Routes>
      {/*</Box>*/}
    </Box>
  );
};
