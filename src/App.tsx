import React, { useMemo, useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./content/home/home.page";
import { StocksPage } from "./content/stocks/stocks.page";
import { ThemePage } from "./content/theme/theme.page";
import {
  INVESTING_EDUCATION_ROUTE,
  HOME_ROUTE,
  NOTES_ROUTE,
  INVESTING_ROUTE,
  THEME_ROUTE,
  INVESTING_REAL_ESTATE_ROUTE,
  TOOLS_ROUTE,
  INVESTING_STOCKS_ROUTE,
  ZBANG_ROUTE,
  PROGRAMMING_ROUTE,
  SETTINGS_ROUTE,
  INVESTING_SCREENER_TOOL_ROUTE,
} from "./util/routes";
import { FinancialsPage } from "./content/education/financials/financials.page";
import { ToolsStocksPage } from "./content/tools/sections/tools-stocks/tools-stocks.page";
import { ToolsRealEstatePage } from "./content/tools/sections/tools-real-estate/tools-real-estate.page";
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
import { ProgrammingPage } from "./content/programming/programming.page";
import { SettingsPage } from "./content/settings/settings.page";
import { ScreenerPage } from "./content/education/screener/screener.page";

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
                  <Route path={PROGRAMMING_ROUTE} Component={ProgrammingPage} />
                  <Route path={INVESTING_ROUTE} Component={StocksPage} />
                  <Route
                    path={SETTINGS_ROUTE}
                    element={
                      <SettingsPage
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                      />
                    }
                  />

                  <Route path={NOTES_ROUTE} Component={NotesPage} />
                  <Route
                    path={TOOLS_ROUTE}
                    element={<Navigate to={INVESTING_STOCKS_ROUTE} />}
                  />
                  <Route
                    path={INVESTING_STOCKS_ROUTE}
                    Component={ToolsStocksPage}
                  />
                  <Route
                    path={INVESTING_REAL_ESTATE_ROUTE}
                    Component={ToolsRealEstatePage}
                  />
                  <Route
                    path={INVESTING_EDUCATION_ROUTE}
                    Component={FinancialsPage}
                  />
                  <Route
                    path={INVESTING_SCREENER_TOOL_ROUTE}
                    Component={ScreenerPage}
                  />
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
