import React from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./content/home/home.page";
import { StocksPage } from "./content/stocks/stocks.page";
import { ThemePage } from "./content/theme/theme.page";
import {
  EDUCATION_ROUTE,
  HOME_ROUTE,
  STOCKS_ROUTE,
  THEME_ROUTE,
  TOOLS_REAL_ESTATE_ROUTE,
  TOOLS_ROUTE,
  TOOLS_STOCKS_ROUTE,
} from "./util/routes";
import { Navbar } from "./components/navbar/navbar";
import { FinancialsPage } from "./content/education/financials/financials.page";
import { ToolsStocksPage } from "./content/tools/sections/tools-stocks/tools-stocks.page";
import { ToolsRealEstatePage } from "./content/tools/sections/tools-real-estate/tools-real-estate.page";

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
              maxWidth: "200px",
            }}
          >
            <Navbar />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              height: "100vh",
              paddingLeft: "20px",
              paddingRight: "20px",
              overflowY: "auto",
            }}
          >
            <Routes>
              <Route path={HOME_ROUTE} Component={HomePage} />
              <Route path={STOCKS_ROUTE} Component={StocksPage} />
              <Route
                path={TOOLS_ROUTE}
                element={<Navigate to={TOOLS_STOCKS_ROUTE} />}
              />
              <Route path={TOOLS_STOCKS_ROUTE} Component={ToolsStocksPage} />
              <Route
                path={TOOLS_REAL_ESTATE_ROUTE}
                Component={ToolsRealEstatePage}
              />
              <Route path={EDUCATION_ROUTE} Component={FinancialsPage} />
              <Route path={THEME_ROUTE} Component={ThemePage} />

              <Route path="*" element={<Navigate to={HOME_ROUTE} />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
