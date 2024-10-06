import { Box } from "@mui/material";
import { MyCheckbox } from "@/components/MyCheckbox";
import { MyInput } from "@/components/MyInput";
import { Score } from "@/content/education/screener/screener.types";
import React from "react";
import Editor from "react-simple-wysiwyg";

interface ScoreProps {
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly score: Score | null;
  readonly setScore: React.Dispatch<React.SetStateAction<Score | null>>;
  readonly notes: string;
  readonly setNotes: React.Dispatch<React.SetStateAction<string>>;
  readonly info: string;
}

export const ScoreField = ({ label, checked, onChange, score, setScore, notes, setNotes, info }: ScoreProps) => {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <MyCheckbox label={label} checked={checked} onChange={onChange} tooltipText={info} />

        {checked && (
          <MyInput
            type="number"
            label="Score"
            value={score ?? ""}
            onChange={(e) => {
              if (!e.target.value) {
                setScore(null);
                return;
              }
              const value = Number(e.target.value);
              if (!Number.isNaN(value)) {
                const score = Math.min(10, Math.max(1, value)) as Score;
                setScore(score);
              }
            }}
            variant="outlined"
            sx={{ width: "80px" }}
          />
        )}
      </Box>
      {checked && (
        <Box>
          <Editor
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          />
        </Box>
      )}
    </Box>
  );
};
