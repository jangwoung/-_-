import React, { useState } from "react";
import { ObjectProps } from "../Object/types"; // ObjectProps型をインポート
import { Modal } from "../../../components/modal";

type TextControlsProps = {
  setObjects: React.Dispatch<React.SetStateAction<ObjectProps[]>>;
};

const TextControls: React.FC<TextControlsProps> = ({ setObjects }) => {
  const [text, setText] = useState("Sample Text");
  const [fontSize, setFontSize] = useState(20);
  const [fill, setFill] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isOpened, setIsOpened] = useState(false);

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
    <div className="flex flex-col items-center justify-start">
    <div
      id="modalContent"
      className={`fixed p-0 z-[100] flex h-[55vh] w-screen sm:w-[420px] sm:w-lg xl:w-xl scroll-mt-0 flex-col items-center hidden-scrollbar rounded-t-2xl bg-white pb-12 duration-200 delay-75 shadow-[0_-8px_12px_4px_rgba(0,0,0,0.3)]
      `}
    >
    <h1 className="mt-8 mb-2 font-bold text-2xl">テキスト</h1>
    <div className="flex flex-col items-start justify-start">
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
      </div>
      <button onClick={addText} style={{ marginTop: "10px" }}>
      <h1 className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg">追加</h1>
      </button>
    </div>
    </div>

  );
};

export default TextControls;
