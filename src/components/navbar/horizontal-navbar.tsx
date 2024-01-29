import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Container from "@mui/material/Container";
import {
  EDUCATION_ROUTE,
  HOME_ROUTE,
  NOTES_ROUTE,
  RESEARCH_ROUTE,
  THEME_ROUTE,
  REAL_ESTATE,
  STOCKS,
  ZBANG_ROUTE,
} from "../../util/routes";
import { useMatch } from "react-router-dom";
import { Colors } from "../../css-style/colors";
import { Monospace } from "../monospace";

const HOME_ROUTE_OBJ = () => ({
  name: "Home",
  path: HOME_ROUTE,
});

const NAVBAR_ITEMS = () => {
  return [
    { name: "Research", path: RESEARCH_ROUTE },
    { name: "Notes", path: NOTES_ROUTE, hidden: true },
    { name: "Stocks", path: STOCKS },
    { name: "Real_estate", path: REAL_ESTATE },
    { name: "Education", path: EDUCATION_ROUTE },
    { name: "Theme", path: THEME_ROUTE, hidden: true },
    { name: "Zbang", path: ZBANG_ROUTE, hidden: true },
  ];
};

export function HorizontalNavbar({
  darkModeEnabled,
}: {
  readonly darkModeEnabled: boolean;
}) {
  const homeRoute = HOME_ROUTE_OBJ();
  const visibleRoutes = NAVBAR_ITEMS().filter((r) => !r.hidden);

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container
        maxWidth="xl"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Toolbar disableGutters>
          <MenuButton route={homeRoute} />

          <Box
            sx={{ ml: 4, display: "flex", justifyContent: "center", gap: 1 }}
          >
            {visibleRoutes.map((item) => (
              <MenuButton key={item.name} route={item} />
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

interface MenuButtonProps {
  readonly route: {
    path: string;
    name: string;
    hidden?: boolean;
  };
  readonly fontSize?: string;
}

const MenuButton = ({ route, fontSize }: MenuButtonProps) => {
  const isActive = useMatch(route.path);

  return route.hidden ? null : (
    <Monospace
      variant="h6"
      noWrap
      component="a"
      href={route.path}
      sx={{
        mr: 2,
        // display: { xs: "none", md: "flex" },
        fontSize: fontSize ?? "0.8rem",
        // fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: ".1rem",
        color: isActive ? Colors.Purple : "inherit",
        textDecoration: isActive ? undefined : "none",
      }}
    >
      {route.name}
    </Monospace>
  );
};
