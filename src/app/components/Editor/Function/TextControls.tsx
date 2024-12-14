import React, { useState } from "react";
import { ObjectProps } from "../Object/types"; // ObjectProps型をインポート

type TextControlsProps = {
  setObjects: React.Dispatch<React.SetStateAction<ObjectProps[]>>;
};

const TextControls: React.FC<TextControlsProps> = ({ setObjects }) => {
  const [text, setText] = useState("Sample Text");
  const [fontSize, setFontSize] = useState(20);
  const [fill, setFill] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");

  const addText = () => {
    setObjects((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "text",
        text,
        fontSize,
        fill,
        fontFamily,
        x: 50,
        y: 50,
      },
    ]);
  };

  return (
    <div style={{ padding: "10px", background: "#f4f4f4", borderRadius: "4px" }}>
      <h3>Text Controls</h3>
      <div style={{ marginBottom: "10px" }}>
        <label>Text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Font Size:</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Color:</label>
        <input
          type="color"
          value={fill}
          onChange={(e) => setFill(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Font Family:</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>
      </div>
      <button onClick={addText} style={{ marginTop: "10px" }}>
        Add Text
      </button>
    </div>
  );
};

export default TextControls;
