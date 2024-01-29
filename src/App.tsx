import React, { useMemo, useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./content/home/home.page";
import { StocksPage } from "./content/stocks/stocks.page";
import { ThemePage } from "./content/theme/theme.page";
import {
  EDUCATION_ROUTE,
  HOME_ROUTE,
  NOTES_ROUTE,
  RESEARCH_ROUTE,
  THEME_ROUTE,
  REAL_ESTATE,
  TOOLS_ROUTE,
  STOCKS,
  ZBANG_ROUTE,
} from "./util/routes";
import { FinancialsPage } from "./content/education/financials/financials.page";
import { ToolsStocksPage } from "./content/tools/sections/tools-stocks/tools-stocks.page";
import { ToolsRealEstatePage } from "./content/tools/sections/tools-real-estate/tools-real-estate.page";
import { Navbar } from "./components/navbar/navbar";
import { NotesPage } from "./content/stocks/notes/notes.page";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { green, deepPurple } from "@mui/material/colors";
import { ZbangPage } from "./content/zbang/zbang.page";
import CssBaseline from "@mui/material/CssBaseline";

import { GlobalStateProvider } from "./util/global-state/global-state";

import { MathJaxContext } from "better-react-mathjax";
import { HorizontalNavbar } from "./components/navbar/horizontal-navbar";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("isDarkModeEnabled") === "true"
  );

  const appTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: deepPurple[500],
          },
          secondary: {
            main: green[700],
          },
        },
      }),
    [darkMode]
  );

  return (
    <React.StrictMode>
      <ThemeProvider theme={appTheme}>
        <GlobalStateProvider initialState={{ darkMode }}>
          <MathJaxContext version={3} config={config}>
            <Box>
              <CssBaseline />
              <BrowserRouter>
                <HorizontalNavbar darkModeEnabled={darkMode} />
                {/*<Navbar darkMode={darkMode} setDarkMode={setDarkMode}>*/}
                <Routes>
                  <Route path={HOME_ROUTE} Component={HomePage} />
                  <Route path={RESEARCH_ROUTE} Component={StocksPage} />
                  <Route path={NOTES_ROUTE} Component={NotesPage} />
                  <Route
                    path={TOOLS_ROUTE}
                    element={<Navigate to={STOCKS} />}
                  />
                  <Route path={STOCKS} Component={ToolsStocksPage} />
                  <Route path={REAL_ESTATE} Component={ToolsRealEstatePage} />
                  <Route path={EDUCATION_ROUTE} Component={FinancialsPage} />
                  <Route path={THEME_ROUTE} Component={ThemePage} />
                  <Route path={ZBANG_ROUTE} Component={ZbangPage} />

                  <Route path="*" element={<Navigate to={HOME_ROUTE} />} />
                </Routes>
                {/*</Navbar>*/}
              </BrowserRouter>
            </Box>
          </MathJaxContext>
        </GlobalStateProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;
