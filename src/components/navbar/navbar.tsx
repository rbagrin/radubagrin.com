import React, { ReactNode, useCallback } from "react";

import { ReactComponent as Close } from "../../icons/close.svg";
import { ReactComponent as Menu } from "../../icons/menu.svg";
import { ReactComponent as Home } from "../../icons/home.svg";
import { ReactComponent as ArrowTrendUp } from "../../icons/arrow-trend-up.svg";
import { ReactComponent as Toolbox } from "../../icons/toolbox.svg";
import { ReactComponent as Palette } from "../../icons/palette.svg";
import { ReactComponent as List } from "../../icons/list.svg";
import { ReactComponent as Education } from "../../icons/education.svg";
import { ReactComponent as Sun } from "../../icons/sun.svg";
import { ReactComponent as Moon } from "../../icons/moon.svg";

import {
  EDUCATION_ROUTE,
  HOME_ROUTE,
  NOTES_ROUTE,
  STOCKS_ROUTE,
  THEME_ROUTE,
  TOOLS_REAL_ESTATE_ROUTE,
  TOOLS_ROUTE,
  TOOLS_STOCKS_ROUTE,
  ZBANG_ROUTE,
} from "../../util/routes";
import { iconSize } from "../../css-style/style";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const NAVBAR_ITEMS = (darkModeEnabled = false) => [
  {
    name: "Home",
    path: HOME_ROUTE,
    icon: <Home {...iconSize} fill={darkModeEnabled ? "white" : "black"} />,
  },
  {
    name: "Stocks",
    path: STOCKS_ROUTE,
    icon: (
      <ArrowTrendUp {...iconSize} fill={darkModeEnabled ? "white" : "black"} />
    ),
    items: [
      {
        name: "Stocks",
        path: STOCKS_ROUTE,
      },
      {
        name: "Notes",
        path: NOTES_ROUTE,
      },
    ],
  },
  {
    name: "Tools",
    path: TOOLS_ROUTE,
    icon: <Toolbox {...iconSize} fill={darkModeEnabled ? "white" : "black"} />,
    items: [
      {
        name: "Stocks",
        path: TOOLS_STOCKS_ROUTE,
      },
      {
        name: "Real estate",
        path: TOOLS_REAL_ESTATE_ROUTE,
      },
    ],
  },
  {
    name: "Education",
    path: EDUCATION_ROUTE,
    icon: (
      <Education {...iconSize} fill={darkModeEnabled ? "white" : "black"} />
    ),
  },
  {
    name: "Theme",
    path: THEME_ROUTE,
    icon: <Palette {...iconSize} fill={darkModeEnabled ? "white" : "black"} />,
  },
  {
    name: "Zbang",
    path: ZBANG_ROUTE,
    icon: <List {...iconSize} fill={darkModeEnabled ? "white" : "black"} />,
  },
];

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

export function Navbar({
  darkMode,
  setDarkMode,
  children,
}: {
  readonly darkMode: boolean;
  readonly setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const setThemeMode = useCallback(() => {
    setDarkMode((prev) => {
      localStorage.setItem("isDarkModeEnabled", prev ? "false" : "true");
      return !prev;
    });
  }, [setDarkMode]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <Menu {...iconSize} />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              onClick={() => setThemeMode()}
              sx={{
                color: darkMode ? "#fcba03" : "#020f3b",
              }}
            >
              {darkMode ? <Sun fill="#ffdd00" /> : <Moon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Box
            sx={{
              width: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5">Menu</Typography>
          </Box>
          <Box>
            <IconButton onClick={handleDrawerClose}>
              <Close {...iconSize} />
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <Box>
          {NAVBAR_ITEMS(darkMode).map((item, index) => (
            <Box>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
              {item.items && (
                <Box sx={{ ml: 10 }}>
                  {item.items.map((subitem) => (
                    <ListItemButton onClick={() => navigate(subitem.path)}>
                      <ListItemText primary={subitem.name} />
                    </ListItemButton>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box
          sx={{
            width: 1,
            maxWidth: "1236px",
            margin: "auto",
            height: 1,
          }}
        >
          {children}
        </Box>
      </Main>
    </Box>
  );
}
