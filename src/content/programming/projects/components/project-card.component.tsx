import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import React from "react";
import { Monospace } from "../../../../components/monospace";

interface ProjectCardProps {
  readonly title: string;
  readonly path: string;
}

export const ProjectCard = ({ title, path }: ProjectCardProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = path === location.pathname;

  return (
    <Card
      onClick={() => {
        navigate(path);
      }}
      sx={{
        width: "200px",
        height: "100%",
        cursor: "pointer",
        ":hover": { transform: "scale(1.05)" },
        bgcolor: isActive ? "#222" : undefined,
      }}
    >
      <CardContent>
        <Monospace sx={{ fontWeight: isActive ? "700" : "500" }}>
          {title}
        </Monospace>
      </CardContent>
    </Card>
  );
};
