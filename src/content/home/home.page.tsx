import React, { useState, useEffect } from "react";
import axios from "axios";

import logo from "../../logo.svg";
import { MAX_PAGE_WIDTH } from "../../css-style/style";

export const HomePage = () => {
  const [text, setText] = useState<string>("");

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
      <header className="App-header">
        <h1>{text}</h1>
        <img src={logo as unknown as string} className="App-logo" alt="logo" />
      </header>
    </div>
  );
};
