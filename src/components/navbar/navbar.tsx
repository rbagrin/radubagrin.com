import React, { useState } from "react";
import { ReactComponent as Home } from "../../icons/home.svg";
import { ReactComponent as ArrowTrendUp } from "../../icons/arrow-trend-up.svg";
import { ReactComponent as Toolbox } from "../../icons/toolbox.svg";
import { ReactComponent as Palette } from "../../icons/palette.svg";
import { ReactComponent as Education } from "../../icons/education.svg";

import "./navbar.css";
import {
  HOME_ROUTE,
  STOCKS_ROUTE,
  THEME_ROUTE,
  TOOLS_ROUTE,
  EDUCATION_ROUTE,
  TOOLS_STOCKS_ROUTE,
  TOOLS_REAL_ESTATE_ROUTE,
} from "../../util/routes";
import { useNavigate } from "react-router-dom";
import { iconSize } from "../../css-style/style";

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
];
export const Navbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const element = document.body;
    element.classList.toggle("dark-mode");
    setDarkMode(element.classList.contains("dark-mode"));
  };

  return (
    <nav className="navbar">
      <div style={{ padding: "20px 20px 20px 20px" }}>
        <button onClick={toggleDarkMode}>{darkMode ? "Light" : "Dark"}</button>
      </div>

      {NAVBAR_ITEMS(darkMode).map((item, idx) => (
        <div
          key={idx}
          className="listItems"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                marginLeft: "20px",
                marginRight: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {item.icon}
            </div>
            <div className="hoverableItem">{item.name}</div>
          </div>
          {item.items && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "75px",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              {item.items.map((i, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(i.path)}
                  className="hoverableItem"
                >
                  {i.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};
