import React from "react";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { cardStyle } from "../income-statement.style";

const HEIGHT = "600px";

export const CashFlowStatementSection = () => {
  return (
    <Card
      sx={{
        padding: 2,
        backgroundColor: "#333",
        borderRadius: 1,
        color: "white",
      }}
    >
      <CardHeader title="Cashflow statement" />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              ...cardStyle,
              height: HEIGHT,
              width: "50%",
              bgcolor: "rgba(87, 149, 173, 0.7)",
            }}
          >
            NET CHANGE IN CASH
          </Box>
          <Box
            sx={{
              height: HEIGHT,
              width: "50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                ...cardStyle,
                height: "100%",
                bgcolor: "rgba(69, 140, 75, 0.7)",
              }}
            >
              OPERATING CASH FLOW
            </Box>
            <Box
              sx={{
                ...cardStyle,
                height: "100%",
                bgcolor: "rgba(69, 140, 75, 0.7)",
              }}
            >
              INVESTING CASH FLOW
            </Box>
            <Box
              sx={{
                ...cardStyle,
                height: "100%",
                bgcolor: "rgba(69, 140, 75, 0.7)",
              }}
            >
              FINANCING CASH FLOW
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
