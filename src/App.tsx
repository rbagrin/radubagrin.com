import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./content/home/home.page";
import { StocksPage } from "./content/stocks/stocks.page";
import { ThemePage } from "./content/theme/theme.page";

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/stocks" Component={StocksPage} />
          <Route path="/theme" Component={ThemePage} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
