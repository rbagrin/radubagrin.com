import React from "react";
import { ReactComponent as Home } from "../../icons/home.svg";
import { ReactComponent as ArrowTrendUp } from "../../icons/arrow-trend-up.svg";
import { ReactComponent as Toolbox } from "../../icons/toolbox.svg";
import { ReactComponent as Palette } from "../../icons/palette.svg";

import "./navbar.css";
import {
  HOME_ROUTE,
  STOCKS_ROUTE,
  THEME_ROUTE,
  TOOLS_ROUTE,
} from "../../util/routes";
import { useNavigate } from "react-router-dom";

const NAVBAR_ITEMS = [
  {
    name: "Home",
    path: HOME_ROUTE,
    icon: <Home width="1rem" height="1rem" />,
  },
  {
    name: "Stocks",
    path: STOCKS_ROUTE,
    icon: <ArrowTrendUp width="1rem" height="1rem" />,
  },
  {
    name: "Tools",
    path: TOOLS_ROUTE,
    icon: <Toolbox width="1rem" height="1rem" />,
  },
  {
    name: "Theme",
    path: THEME_ROUTE,
    icon: <Palette width="1rem" height="1rem" />,
  },
];
export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <ul>
        {NAVBAR_ITEMS.map((item) => (
          <li onClick={() => navigate(item.path)} className="listItems">
            <div style={{ marginLeft: "20px", marginRight: "20px" }}>
              {item.icon}
            </div>
            <p>{item.name}</p>
          </li>
        ))}
      </ul>
    </nav>
  );
};
