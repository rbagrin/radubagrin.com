import React from "react";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { cardStyle } from "../income-statement.style";

const HEIGHT = "600px";
const ASSETS_COLOR = "rgba(62, 161, 37, 0.4)";
const LIABILITIES_COLOR = "rgba(176, 55, 55, 0.7)";
const SH_EQUITY_COLOR = "rgba(51, 148, 204, 0.7)";

export const BalanceSheetSection = () => {
  return (
    <Card
      sx={{
        padding: 2,
        backgroundColor: "#333",
        borderRadius: 1,
        color: "white",
      }}
    >
      <CardHeader title="Balance sheet" />
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
              width: "25%",
            }}
          >
            <Box
              sx={{
                ...cardStyle,
                height: "35%",
                bgcolor: ASSETS_COLOR,
              }}
            >
              CURRENT ASSETS
            </Box>
            <Box
              sx={{
                ...cardStyle,
                bgcolor: ASSETS_COLOR,
                height: "65%",
              }}
            >
              LONG TERM ASSETS
            </Box>
          </Box>

          <Box
            sx={{
              ...cardStyle,
              bgcolor: ASSETS_COLOR,
              height: HEIGHT,
              width: "25%",
            }}
          >
            ASSETS
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 2,
              width: "50%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                gap: 2,
                height: "80%",
              }}
            >
              <Box
                sx={{
                  ...cardStyle,
                  bgcolor: LIABILITIES_COLOR,
                  height: "100%",
                }}
              >
                LIABILITIES
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    ...cardStyle,
                    bgcolor: LIABILITIES_COLOR,
                    height: "30%",
                  }}
                >
                  CURRENT LIABILITIES
                </Box>
                <Box
                  sx={{
                    ...cardStyle,
                    bgcolor: LIABILITIES_COLOR,
                    height: "70%",
                  }}
                >
                  LONG TERM LIABILITIES
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                ...cardStyle,
                bgcolor: SH_EQUITY_COLOR,
                height: "20%",
              }}
            >
              SHAREHOLDERS EQUITY
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
