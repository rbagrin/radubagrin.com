import { Box, SwipeableDrawer, Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface DrawerProps {
  readonly isOpen: boolean;
  readonly setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly title: string;
  readonly children: ReactNode;
  readonly anchor?: "left" | "top" | "right" | "bottom";
  readonly onClose?: Function;
}
export const MyDrawer = ({
  isOpen,
  setIsOpen,
  title,
  children,
  anchor = "right",
  onClose,
}: DrawerProps) => {
  return (
    <React.Fragment>
      <SwipeableDrawer
        open={isOpen}
        anchor={anchor}
        onClose={() => {
          if (onClose) onClose();
          setIsOpen(false);
        }}
        onOpen={() => setIsOpen(true)}
      >
        <Box sx={{ width: "600px", p: 4 }}>
          <Typography variant="h2">{title}</Typography>
          <Box sx={{ mt: 4 }}>{children}</Box>
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
};
