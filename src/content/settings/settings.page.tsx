import React from "react";
import { Box, Checkbox, Switch } from "@mui/material";
import { Monospace } from "../../components/monospace";

interface SettingsPageProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SettingsPage = ({ darkMode, setDarkMode }: SettingsPageProps) => {
  return (
    <Box sx={{ p: 4 }}>
      <Monospace>Theme</Monospace>

      {/*// TODO: switch and checkbox not working as expecting*/}
      <Switch
        checked={darkMode}
        onChange={() => setDarkMode((prev) => !prev)}
        inputProps={{ "aria-label": "controlled" }}
      />

      <Checkbox
        checked={darkMode}
        onChange={() => setDarkMode((prev) => !prev)}
        inputProps={{ "aria-label": "controlled" }}
      />
    </Box>
  );
};
