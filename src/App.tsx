import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./content/home/home.page";
import { StocksPage } from "./content/stocks/stocks.page";
import { ThemePage } from "./content/theme/theme.page";
import {HOME_ROUTE, STOCKS_ROUTE, THEME_ROUTE, TOOLS_ROUTE} from "./util/routes";
import {ToolsPage} from "./content/tools/tools.page";

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path={HOME_ROUTE} Component={HomePage} />
          <Route path={STOCKS_ROUTE} Component={StocksPage} />
          <Route path={TOOLS_ROUTE} Component={ToolsPage} />
          <Route path={THEME_ROUTE} Component={ThemePage} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
