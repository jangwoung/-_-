// components/Editor/Function/ColorReducer.tsx
import React, { useState } from "react";

interface EdgeFilterProps {
  edgelevel: number;
  onEdgeLevelChange: (newLevel: number) => void;
}


const EdgeFilter: React.FC<EdgeFilterProps> = ({ edgelevel, onEdgeLevelChange }) => {

  return (

    <div className="flex flex-col items-center justify-start">
      <div
        id="modalContent"
        className={`fixed p-0 z-[100] flex h-[55vh] w-screen sm:w-[420px] sm:w-lg xl:w-xl scroll-mt-0 flex-col items-center hidden-scrollbar rounded-t-2xl bg-white pb-12 duration-200 delay-75 shadow-[0_-8px_12px_4px_rgba(0,0,0,0.3)]
        `}
      >


      <h1 className="mt-8 mb-2 font-bold text-2xl">エッジフィルター</h1>
      <h1 className="mt-8 mb-2 font-bold text-2xl">level: {edgelevel}</h1>
      <input
        type="range"
        id="edge-level"
        min="2"
        max="10"
        value={edgelevel}
        onChange={(e) => onEdgeLevelChange(Number(e.target.value))}
        className="slider"
      />
    </div>
    </div>
  );
};

export default EdgeFilter;
