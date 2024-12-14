import React, { useState } from "react";
import { ObjectProps } from "../Object/types"; // ObjectProps型をインポート

type ShapeControlsProps = {
  setObjects: React.Dispatch<React.SetStateAction<ObjectProps[]>>;
};

const ShapeControls: React.FC<ShapeControlsProps> = ({ setObjects }) => {
  const [width, setWidth] = useState(100); // 四角形の初期幅
  const [height, setHeight] = useState(100); // 四角形の初期高さ
  const [fill, setFill] = useState("#00ff00"); // 四角形の初期色
  const [stroke, setStroke] = useState("#000000"); // 四角形の初期枠線色

  // 四角形を追加する関数
  const addShape = () => {
    setObjects((prev) => [
      ...prev,
      {
        id: prev.length + 1, // IDをユニークにする
        type: "shape", // 四角形のタイプ
        x: 50, // 初期位置X
        y: 50, // 初期位置Y
        width,
        height,
        fill,
        stroke,
      },
    ]);
  };

  return (
    <div style={{ padding: "10px", background: "#f4f4f4", borderRadius: "4px" }}>
      <h3>Shape Controls</h3>
      <div style={{ marginBottom: "10px" }}>
        <label>Width:</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Height:</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
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
        <label>Stroke Color:</label>
        <input
          type="color"
          value={stroke}
          onChange={(e) => setStroke(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <button onClick={addShape} style={{ marginTop: "10px" }}>
        Add Shape
      </button>
    </div>
  );
};

export default ShapeControls;
