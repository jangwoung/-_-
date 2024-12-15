// components/Editor/Function/ColorReducer.tsx
import React, { useState } from "react";
import { Modal } from "../../../components/modal";
interface ColorReducerProps {
  level: number;
  onReductionLevelChange: (newLevel: number) => void;
}


const ColorReducer: React.FC<ColorReducerProps> = ({ level, onReductionLevelChange }) => {
  const [isOpened, setIsOpened] = useState(false);
  // 四角形を追加する関数
  const returncolor = () => {

  };
  return (

    <div className="flex flex-col items-center justify-start">
      <div
        id="modalContent"
        className={`fixed p-0 z-[100] flex h-[55vh] w-screen sm:w-[420px] sm:w-lg xl:w-xl scroll-mt-0 flex-col items-center hidden-scrollbar rounded-t-2xl bg-white pb-12 duration-200 delay-75 shadow-[0_-8px_12px_4px_rgba(0,0,0,0.3)]
        `}
      >


      <h1 className="mt-8 mb-2 font-bold text-2xl">減色フィルター</h1>
      <h1 className="mt-8 mb-2 font-bold text-2xl">level: {level}</h1>
      <input
        type="range"
        id="color-level"
        min="2"
        max="32"
        value={level}
        onChange={(e) => onReductionLevelChange(Number(e.target.value))}
        className="slider"
      />
    </div>
    </div>
  );
};

export default ColorReducer;
