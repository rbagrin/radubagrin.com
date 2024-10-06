import React, { useCallback } from "react";
import { MyDrawer } from "../../../../../components/MyDrawer";
import { Box } from "@mui/material";
import { ScoreData, ScoreSection, ScreenerStockData } from "../../screener.types";
import Typography from "@mui/material/Typography";
import { LoaderCircular } from "../../../../../util/components/loader-circular.component";

import { ScoreField } from "../../score-field.component";
import Editor from "react-simple-wysiwyg";
import IconButton from "@mui/material/IconButton";
import { iconSize } from "../../../../../css-style/style";
import { ReactComponent as Pen } from "../../../../../icons/pen.svg";
import { ReactComponent as Save } from "../../../../../icons/save.svg";

export const ScreenerSectionDrawer = ({
  isOpen,
  setIsOpen,
  section,
  title,
  afterClose,
  stock,
  setStock,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  stock: ScreenerStockData | null;
  section: "valuation" | "ratios" | "incomeStatement" | "balanceSheet" | "cashFlowStatement";
  title: string;
  setStock: React.Dispatch<React.SetStateAction<ScreenerStockData | null>>;
  afterClose?: () => void;
}) => {
  const [editOverviewNotes, setEditOverviewNotes] = React.useState(false);

  const updateStockSection = useCallback(
    (update: Partial<ScoreSection>) => {
      setStock((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          ...update,
        },
      }));
    },
    [section, setStock]
  );

  const updateStockSectionData = useCallback(
    (update: Partial<ScoreData>, index: number) => {
      setStock((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          data: prev[section].data.map((d, idx) => (idx === index ? { ...d, ...update } : d)),
        },
      }));
    },
    [section, setStock]
  );

  return (
    <MyDrawer isOpen={isOpen} setIsOpen={setIsOpen} title={title} width="medium" afterClose={afterClose}>
      {stock ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {stock.name}
            </Typography>

            {editOverviewNotes ? (
              <Box sx={{ width: "16px" }}>
                <IconButton
                  onClick={() => {
                    setEditOverviewNotes(false);
                  }}
                >
                  <Save {...iconSize} />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ width: "16px" }}>
                <IconButton
                  onClick={() => {
                    setEditOverviewNotes(true);
                  }}
                >
                  <Pen {...iconSize} />
                </IconButton>
              </Box>
            )}
          </Box>
          {editOverviewNotes ? (
            <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
              <Editor
                value={stock[section].overviewNotes}
                onChange={(e) => {
                  const update: Partial<ScoreSection> = { overviewNotes: e.target.value };
                  updateStockSection(update);
                }}
              />
            </Box>
          ) : stock[section].overviewNotes !== "<br>" ? (
            <Box dangerouslySetInnerHTML={{ __html: stock[section].overviewNotes }} />
          ) : (
            <Box>Add your notes here...</Box>
          )}

          {stock[section].data.map((entry, index) => (
            <ScoreField
              key={index}
              label={entry.title}
              checked={entry.enabled}
              onChange={(enabled: boolean) => {
                const update: Partial<ScoreData> = { enabled };
                updateStockSectionData(update, index);
              }}
              score={entry.score}
              setScore={(score: number) => {
                const update: Partial<ScoreData> = { score };
                updateStockSectionData(update, index);
              }}
              notes={entry.notes}
              setNotes={(notes: string) => {
                const update: Partial<ScoreData> = { notes };
                updateStockSectionData(update, index);
              }}
              info={entry.info}
            />
          ))}
        </Box>
      ) : (
        <LoaderCircular />
      )}
    </MyDrawer>
  );
};
