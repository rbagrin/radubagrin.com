import React from "react";
import "./App.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./content/home/home.page.tsx";
import { StocksPage } from "./content/stocks/stocks.page.tsx";

const App = () => {
  return <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={HomePage} />
        <Route path='/stocks' Component={StocksPage} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
};

export default App;
