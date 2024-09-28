import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Container from "@mui/material/Container";
import {
  INVESTING_EDUCATION_ROUTE,
  HOME_ROUTE,
  INVESTING_ROUTE,
  INVESTING_REAL_ESTATE_ROUTE,
  INVESTING_STOCKS_ROUTE,
  PROGRAMMING_ROUTE,
  SETTINGS_ROUTE,
  INVESTING_SCREENER_TOOL_ROUTE,
} from "../../util/routes";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { Monospace } from "../monospace";
import { Menu, MenuItem } from "@mui/material";

interface NavbarItem {
  name: string;
  path: string;
  items?: NavbarItem[];
  hidden?: boolean;
}

const MAIN_NAVBAR_ITEMS = () => {
  return [
    { name: "Home", path: HOME_ROUTE },
    { name: "Programming", path: PROGRAMMING_ROUTE },
    { name: "Investing", path: INVESTING_ROUTE },
    { name: "Settings", path: SETTINGS_ROUTE },
  ];
};
const NAVBAR_ITEMS = (darkModeEnabled: boolean): NavbarItem[] => {
  return [
    {
      name: "Home",
      path: HOME_ROUTE,
      items: [
        { name: "Programming", path: PROGRAMMING_ROUTE },
        { name: "Investing", path: INVESTING_ROUTE },
        { name: "Settings", path: SETTINGS_ROUTE },
      ],
    },
    {
      name: "Programming",
      path: PROGRAMMING_ROUTE,
      items: [
        { name: "Page 1", path: PROGRAMMING_ROUTE },
        { name: "Page 2", path: "/page2" },
      ],
    },
    {
      name: "Investing",
      path: INVESTING_ROUTE,
      items: [
        { name: "Research", path: INVESTING_ROUTE },
        { name: "Stocks", path: INVESTING_STOCKS_ROUTE },
        { name: "Real_estate", path: INVESTING_REAL_ESTATE_ROUTE },
        { name: "Education", path: INVESTING_EDUCATION_ROUTE },
        { name: "Screener", path: INVESTING_SCREENER_TOOL_ROUTE },
      ],
    },
    { name: "Settings", path: SETTINGS_ROUTE },
  ];
};

export function HorizontalNavbar({
  darkModeEnabled,
}: {
  readonly darkModeEnabled: boolean;
}) {
  const location = useLocation();
  const visibleRoutes = NAVBAR_ITEMS(darkModeEnabled).filter((r) => !r.hidden);
  const currentItem = visibleRoutes.find(
    (r) =>
      (location.pathname === HOME_ROUTE && r.path === HOME_ROUTE) ||
      (location.pathname !== HOME_ROUTE &&
        r.path !== HOME_ROUTE &&
        location.pathname.startsWith(r.path))
  );

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", alignItems: "center" }}>
          {location.pathname !== HOME_ROUTE && (
            <MenuButton
              key="home-main"
              route={{ name: "Home", path: HOME_ROUTE }}
            />
          )}
          {location.pathname !== HOME_ROUTE && (
            <MenuButton
              key={currentItem.name}
              route={currentItem}
              dropdown={location.pathname !== HOME_ROUTE}
            />
          )}
          <Box
            sx={{ ml: 4, display: "flex", justifyContent: "center", gap: 0 }}
          >
            {currentItem.items?.map((item) => (
              <MenuButton key={item.name} route={item} />
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

interface MenuButtonProps {
  readonly route: NavbarItem;
  readonly fontSize?: string;
  readonly dropdown?: boolean;
}

const MenuButton = ({ route, fontSize, dropdown = false }: MenuButtonProps) => {
  const navigate = useNavigate();

  const isActive = useMatch(route.path);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (path?: string) => {
    if (path) handleMenuBtnClick(path);
    setAnchorEl(null);
  };

  const handleMenuBtnClick = (path?: string) => {
    navigate(path ?? route.path);
  };

  return route.hidden ? null : (
    <Box>
      <Monospace
        variant="h6"
        noWrap
        component="a"
        onClick={dropdown ? handleClick : () => handleMenuBtnClick()}
        sx={{
          mr: 2,
          // display: { xs: "none", md: "flex" },
          fontSize: fontSize ?? "0.8rem",
          // fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".1rem",
          // color: isActive ? Colors.Purple : "inherit",
          textDecoration: isActive ? undefined : "none",
          py: 2,
          px: 1,
          cursor: "pointer",
        }}
      >
        {route.name}
      </Monospace>

      {dropdown && (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {MAIN_NAVBAR_ITEMS().map((r) => (
            <MenuItem key={r.name} onClick={() => handleClose(r.path)}>
              <Monospace component="a" sx={{ textDecoration: "none" }}>
                {r.name}
              </Monospace>
            </MenuItem>
          ))}
        </Menu>
      )}
    </Box>
  );
};
