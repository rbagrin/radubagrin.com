import React from "react";

import { Box } from "@mui/material";
import { Content } from "../../util/components/content.component";
import { MainHomeCard } from "./components/main-home-card.component";
import { TechStackCard } from "./components/tech-stack-card.component";
import { AWSSiteCard } from "./components/aws-site-card.component";

// TODO: 1 - on hover scale up card
// TODO: 2 - Description + My services Col 2
// TODO: 3 - Col 3 - skills list
// TODO: 4 - Col 3 bottom - link to aws.radubagrin.com
// TODO: 5 - Add an "About me" section to promote yourself
// https://www.knowledgehut.com/blog/web-development/full-stack-developer-portfolio
export const HomePage = () => {
  return (
    <Content className="App">
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <MainHomeCard />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          <TechStackCard />
          <AWSSiteCard />
        </Box>
      </Box>
    </Content>
  );
};
