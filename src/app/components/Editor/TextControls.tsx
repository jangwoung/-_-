import React from "react";
import styles from './styles/start.module.css';

type TextControlsProps = {
  textProps: {
    text: string;
    fontSize: number;
    fill: string;
    fontFamily: string;
    x: number;
    y: number;
  };
  setTextProps: React.Dispatch<
    React.SetStateAction<{
      text: string;
      fontSize: number;
      fill: string;
      fontFamily: string;
      x: number;
      y: number;
    }>
  >;
};

const TextControls: React.FC<TextControlsProps> = ({ textProps, setTextProps }) => {
  return (
    <>
      <input
        type="text"
        value={textProps.text}
        onChange={(e) => setTextProps((prev) => ({ ...prev, text: e.target.value }))}
        placeholder="Enter text"
      />
      <input
        type="color"
        value={textProps.fill}
        onChange={(e) => setTextProps((prev) => ({ ...prev, fill: e.target.value }))}
      />
      <input
        type="number"
        value={textProps.fontSize}
        onChange={(e) =>
          setTextProps((prev) => ({ ...prev, fontSize: Number(e.target.value) }))
        }
      />
      <select
        value={textProps.fontFamily}
        onChange={(e) => setTextProps((prev) => ({ ...prev, fontFamily: e.target.value }))}
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>
    </>
  );
};

export default TextControls;
