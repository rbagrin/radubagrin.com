import React, { useEffect, useMemo, useState } from "react";

import { ReactComponent as Close } from "../../icons/close.svg";
import { ReactComponent as Menu } from "../../icons/menu.svg";
import { ReactComponent as Home } from "../../icons/home.svg";
import { ReactComponent as ArrowTrendUp } from "../../icons/arrow-trend-up.svg";
import { ReactComponent as Toolbox } from "../../icons/toolbox.svg";
import { ReactComponent as Palette } from "../../icons/palette.svg";
import { ReactComponent as Education } from "../../icons/education.svg";

import "./navbar.css";
import { useNavigate } from "react-router-dom";
import {
  EDUCATION_ROUTE,
  HOME_ROUTE,
  STOCKS_ROUTE,
  THEME_ROUTE,
  TOOLS_REAL_ESTATE_ROUTE,
  TOOLS_ROUTE,
  TOOLS_STOCKS_ROUTE,
} from "../../util/routes";
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

function getCurrentDimension() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export const Navbar = ({ children }) => {
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("isDarkModeEnabled") === "true"
  );
  const mobileView = useMemo(
    () => screenSize.width < screenSize.height,
    [screenSize]
  );

  const navigate = useNavigate();

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const element = document.body;

    if (darkMode) {
      localStorage.setItem("isDarkModeEnabled", "true");
      if (!element.classList.contains("dark-mode"))
        element.classList.add("dark-mode");
    } else {
      localStorage.setItem("isDarkModeEnabled", "false");
      element.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          height: "60px",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          backgroundColor: "#874488",
        }}
      >
        <div onClick={handleMenuClick} className="menuIcon">
          <Menu width={40} height={40} />
        </div>

        <div>
          <button
            className="button-pill button-light button-s"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="drawer">
          <div className="listContainer">
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
                  <div className="itemIcon">{item.icon}</div>
                  <div className="itemName">{item.name}</div>
                </div>
                {item.items && (
                  <div className="subItem">
                    {item.items.map((i, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(i.path)}
                        className="itemName"
                      >
                        {i.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            style={{ padding: "10px", marginTop: "0px" }}
            onClick={handleMenuClick}
          >
            <div className="closeDrawerBtn">
              <Close width={45} height={45} />
            </div>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
};
