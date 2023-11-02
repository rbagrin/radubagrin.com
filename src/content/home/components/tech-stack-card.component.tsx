import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";

export const TechStackCard = () => {
  return (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5">
            I design and develop experiences that make people's lives simple.
          </Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: "25%",
              bgcolor: "#eee",
              p: 1,
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ":hover": { transform: "scale(1.05)" },
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg"
              width="110px"
              height="75px"
              alt="NodeJS"
            />
          </Box>
          <Box
            sx={{
              width: "25%",
              bgcolor: "#eee",
              p: 1,
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ":hover": { transform: "scale(1.05)" },
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
              width="75px"
              height="75px"
              alt="NodeJS"
            />
          </Box>
          <Box
            sx={{
              width: "25%",
              bgcolor: "#eee",
              p: 1,
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ":hover": { transform: "scale(1.05)" },
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg"
              width="75px"
              height="75px"
              alt="NodeJS"
            />
          </Box>
          <Box
            sx={{
              width: "25%",
              bgcolor: "#eee",
              p: 1,
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ":hover": { transform: "scale(1.05)" },
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
              width="110px"
              height="75px"
              alt="NodeJS"
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            gap: 1,
            my: 2,
          }}
        >
          <Box
            sx={{
              width: "35%",
              bgcolor: "#eee",
              p: 1,
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ":hover": { transform: "scale(1.05)" },
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg"
              width="65px"
              height="65px"
              alt="NodeJS"
            />
          </Box>
          <Box
            sx={{
              width: "35%",
              bgcolor: "#eee",
              p: 1,
              borderRadius: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ":hover": { transform: "scale(1.05)" },
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg"
              width="210px"
              height="75px"
              alt="NodeJS"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
