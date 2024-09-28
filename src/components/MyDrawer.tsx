import { Box, Drawer, Typography } from "@mui/material";
import React, { ReactNode, useCallback } from "react";

const DEFAULT_WIDTH = "600px";
const widthToCss = {
  normal: DEFAULT_WIDTH,
  medium: "50vw",
  full: "95vw",
};

interface DrawerProps {
  readonly isOpen: boolean;
  readonly setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly title: string;
  readonly children: ReactNode;
  readonly anchor?: "left" | "top" | "right" | "bottom";
  readonly onClose?: Function;
  readonly afterClose?: Function;
  readonly width?: "normal" | "medium" | "full";
}

export const MyDrawer = ({
  isOpen,
  setIsOpen,
  title,
  children,
  anchor = "right",
  onClose,
  afterClose,
  width = "normal",
}: DrawerProps) => {
  const closeDrawer = useCallback(() => {
    if (onClose) onClose();
    setIsOpen(false);

    // Set a timeout to run after 300ms when the drawer is closed
    setTimeout(() => {
      if (afterClose) afterClose();
    }, 300); // 300ms delay
  }, [onClose, setIsOpen, afterClose]);

  return (
    <Drawer
      open={isOpen}
      anchor={anchor}
      onClose={closeDrawer}
      slotProps={{
        backdrop: {
          onClick: closeDrawer,
        },
      }}
    >
      <Box sx={{ width: widthToCss[width] ?? DEFAULT_WIDTH, p: 4 }}>
        <Typography variant="h2">{title}</Typography>
        <Box sx={{ mt: 4 }}>{children}</Box>
      </Box>
    </Drawer>
  );
};
