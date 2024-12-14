import React, { useState } from "react";
import { ObjectProps } from "../Object/types"; // ObjectProps型をインポート
import { Modal } from "../../../components/modal";

type ShapeControlsProps = {
  setObjects: React.Dispatch<React.SetStateAction<ObjectProps[]>>;
};

const ShapeControls: React.FC<ShapeControlsProps> = ({ setObjects }) => {
  const [width, setWidth] = useState(100); // 四角形の初期幅
  const [height, setHeight] = useState(100); // 四角形の初期高さ
  const [fill, setFill] = useState("#00ff00"); // 四角形の初期色
  const [stroke, setStroke] = useState("#000000"); // 四角形の初期枠線色
  const [isOpened, setIsOpened] = useState(false);

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
    <div className="flex flex-col items-center justify-start">
      <div
        id="modalContent"
        className={`fixed p-0 z-[100] flex h-[55vh] w-screen sm:w-[420px] sm:w-lg xl:w-xl scroll-mt-0 flex-col items-center hidden-scrollbar rounded-t-2xl bg-white pb-12 duration-200 delay-75 shadow-[0_-8px_12px_4px_rgba(0,0,0,0.3)]
        `}
      >


      <h1 className="mt-8 mb-2 font-bold text-2xl">四角形</h1>

      <div className="flex flex-col items-start justify-start">
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
        <label>Grid Color:</label>
        <input
          type="color"
          value={fill}
          onChange={(e) => setFill(e.target.value)}
          style={{ marginLeft: "20px" }}
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
      </div>
      <button onClick={addShape} style={{ marginTop: "10px" }}>
        <h1 className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg">追加</h1>
      </button>
    </div>
    </div>

  );
};

export default ShapeControls;
