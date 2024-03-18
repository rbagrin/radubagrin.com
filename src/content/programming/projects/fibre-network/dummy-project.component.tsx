import React from "react";

import { Monospace } from "../../../../components/monospace";
import { Box } from "@mui/material";

interface DummyProjectProps {
  readonly title: string;
}

export const DummyProject = ({ title }: DummyProjectProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box>
        <Monospace align="center">{title}</Monospace>
        <Monospace align="center">comming soon...</Monospace>
      </Box>
    </Box>
  );
};
