import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";

export const AWSSiteCard = () => {
  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography variant="h5">See my AWS hosted app here</Typography>
        <Box sx={{ p: 2, ":hover": { transform: "scale(1.05)" } }}>
          <img
            src="https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png"
            alt="AWS"
            width="90%"
            style={{
              borderRadius: "15px",
              cursor: "pointer",
            }}
            onClick={() =>
              window.open("https://aws.radubagrin.com", "_blank", "noreferrer")
            }
          />
        </Box>
      </CardContent>
    </Card>
  );
};
