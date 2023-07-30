import React, { useState, useEffect } from "react";
import axios from "axios";

import { MAX_PAGE_WIDTH } from "../../css-style/style";
import { ReactComponent as Linkedin } from "../../icons/linkedin.svg";
import { ReactComponent as Github } from "../../icons/github.svg";
import { ReactComponent as Envelope } from "../../icons/envelope.svg";
import { ReactComponent as Download } from "../../icons/download.svg";

import {
  Card,
  Button,
  Box,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";

// TODO: 1 - on hover scale up card
// TODO: 2 - Description + My services Col 2
// TODO: 3 - Col 3 - skills list
// TODO: 4 - Col 3 bottom - link to aws.radubagrin.com
// TODO: 5 - Add an "About me" section to promote yourself
// https://www.knowledgehut.com/blog/web-development/full-stack-developer-portfolio
export const HomePage = () => {
  const [text, setText] = useState<string>("");
  const isDarkMode = true;

  useEffect(() => {
    (async () => {
      try {
        const text = (await axios.get("/api")).data;
        setText(text);
      } catch {
        setText("ERROR! BACKEND IS DOWN!");
      }
    })();
  }, []);

  return (
    <div className="App" style={{ width: "100%", maxWidth: MAX_PAGE_WIDTH }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Card sx={{ flex: 1, minWidth: "22rem" }}>
          <CardMedia
            component="img"
            height="130"
            image="https://images.unsplash.com/photo-1503437313881-503a91226402?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
            alt="Profile image"
          />
          <CardContent>
            <Typography
              variant="h2"
              sx={{ fontWeight: "bold" }}
              color="text.secondary"
            >
              Radu Bagrin
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold" }}
              color="secondary"
            >
              Full Stack Engineer
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "end" }}>
              <Typography variant="h6">Founding Engineer at</Typography>
              <Box>
                <img
                  src="https://zelt.app/wp-content/themes/zelt/assets/img/logo.svg"
                  width="50px"
                  style={isDarkMode ? { filter: "invert(100%)" } : {}}
                  alt="Zelt"
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "end" }}>
              <Box sx={{}}>
                <Typography variant="h6">Ex</Typography>
              </Box>
              <Box sx={{}}>
                <img
                  src="https://www.bitdefender.co.uk/content/dam/bitdefender/splitter-homepage/black_company_logo.svg"
                  width="120px"
                  color="white"
                  style={isDarkMode ? { filter: "invert(100%)" } : {}}
                  alt='Bitdefender'
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <IconButton
                sx={{ width: "50px", height: "50px", color: "#0e76a8" }}
                onClick={() => {
                  window.open("https://www.linkedin.com/in/rbagrin/", "_blank");
                }}
              >
                <Linkedin width={40} height={40} />
              </IconButton>

              <IconButton
                sx={{ width: "50px", height: "50px" }}
                onClick={() => {
                  window.open("https://github.com/rbagrin", "_blank");
                }}
              >
                <Github width={40} height={40} />
              </IconButton>
            </Box>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              onClick={() => {
                window.location =
                  "mailto:bagrin.radu@gmail.com" as unknown as Location;
              }}
              startIcon={<Envelope />}
            >
              Contact me
            </Button>
            <Button variant="outlined" endIcon={<Download />}>
              Download CV
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            
            

            <Typography>
              I design and develop experiences that make people's lives simple.
              Bla blah bald asd kajd saklk aih sakdih kjsad
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};
