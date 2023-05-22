import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./content/home/home.page";
import { StocksPage } from "./content/stocks/stocks.page";
import { ThemePage } from "./content/theme/theme.page";
import {
  HOME_ROUTE,
  STOCKS_ROUTE,
  THEME_ROUTE,
  TOOLS_ROUTE,
} from "./util/routes";
import { ToolsPage } from "./content/tools/tools.page";
import { Navbar } from "./components/navbar/navbar";

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <div
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              width: "20%",
              maxWidth: "300px",
            }}
          >
            <Navbar />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <Routes>
              <Route path={HOME_ROUTE} Component={HomePage} />
              <Route path={STOCKS_ROUTE} Component={StocksPage} />
              <Route path={TOOLS_ROUTE} Component={ToolsPage} />
              <Route path={THEME_ROUTE} Component={ThemePage} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
