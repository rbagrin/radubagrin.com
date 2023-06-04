import React from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./content/home/home.page";
import { StocksPage } from "./content/stocks/stocks.page";
import { ThemePage } from "./content/theme/theme.page";
import {
  EDUCATION_ROUTE,
  HOME_ROUTE,
  NOTES_ROUTE,
  STOCKS_ROUTE,
  THEME_ROUTE,
  TOOLS_REAL_ESTATE_ROUTE,
  TOOLS_ROUTE,
  TOOLS_STOCKS_ROUTE,
} from "./util/routes";
import { FinancialsPage } from "./content/education/financials/financials.page";
import { ToolsStocksPage } from "./content/tools/sections/tools-stocks/tools-stocks.page";
import { ToolsRealEstatePage } from "./content/tools/sections/tools-real-estate/tools-real-estate.page";
import { Navbar } from "./components/navbar/navbar";
import { NotesPage } from "./content/stocks/notes/notes.page";

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Navbar>
          <Routes>
            <Route path={HOME_ROUTE} Component={HomePage} />
            <Route path={STOCKS_ROUTE} Component={StocksPage} />
            <Route path={NOTES_ROUTE} Component={NotesPage} />
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
        </Navbar>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
