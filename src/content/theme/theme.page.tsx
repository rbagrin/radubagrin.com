import React, { useState } from "react";
import { Input } from "../../components/forms/Input";

export const ThemePage = () => {
  const [numberValue, setNumberValue] = useState<number>(0);
  const [textValue, setTextValue] = useState<string>("");

  return (
    <div style={{ width: "100%" }}>
      <h1>Buttons</h1>
      {/*<div*/}
      {/*  style={{*/}
      {/*    display: "flex",*/}
      {/*    gap: "5px",*/}
      {/*    marginTop: "20px",*/}
      {/*    alignItems: "center",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <button>Default</button>*/}
      {/*  <button className="outline">Default outline</button>*/}
      {/*  <button className="secondary">secondary</button>*/}
      {/*  <button className="secondary outline">secondary outline</button>*/}
      {/*  <button className="contrast">contrast</button>*/}
      {/*  <button className="contrast outline">contrast outline</button>*/}

      {/*  <button className="error">error</button>*/}
      {/*  <button className="error outline">error outline</button>*/}
      {/*</div>*/}

      {/*<h1>Paragraphs</h1>*/}

      {/*<p className="title1">This is an example of Title1.</p>*/}
      {/*<h1>This is an example of h1.</h1>*/}
      {/*<h2>This is an example of h2.</h2>*/}
      {/*<h3>This is an example of h3.</h3>*/}
      {/*<h4>This is an example of h4.</h4>*/}
      {/*<h5>This is an example of h5.</h5>*/}
      {/*<h6>This is an example of h6.</h6>*/}
      {/*<p>This is an example of p.</p>*/}

      {/*<code>This is an example of code.</code>*/}

      {/*<Input*/}
      {/*  name="number-input"*/}
      {/*  label="Number input"*/}
      {/*  type="number"*/}
      {/*  value={numberValue}*/}
      {/*  setValue={setNumberValue}*/}
      {/*/>*/}

      {/*<Input*/}
      {/*  name="text-input"*/}
      {/*  label="Text input"*/}
      {/*  type="text"*/}
      {/*  value={textValue}*/}
      {/*  setValue={setTextValue}*/}
      {/*  size="xl"*/}
      {/*/>*/}
    </div>
  );
};
