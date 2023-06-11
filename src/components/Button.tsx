import { styled } from "@mui/material/styles";
import { Button as MUIButton } from "@mui/material";

export const Button = styled(MUIButton)(({ theme, color = "primary" }) => ({
  ":hover": {
    // color: theme.palette[color].main,
    // backgroundColor: "white",
    color: "white",
  },
}));
