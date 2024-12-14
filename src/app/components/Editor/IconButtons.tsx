import React from "react";
import styles from "./styles/canvas.module.css";
import { IoColorFilterSharp } from "react-icons/io5"; // カラーフィルタアイコン
import { PiTextAaFill } from "react-icons/pi"; // テキスト編集アイコン
import { HiMiniRectangleGroup } from "react-icons/hi2"; // 長方形グループアイコン


type IconButtonsProps = {
  setShowColorReducer: React.Dispatch<React.SetStateAction<boolean>>; 
  setShowTextControl: React.Dispatch<React.SetStateAction<boolean>>; 
  setShowShapeControl: React.Dispatch<React.SetStateAction<boolean>>; 
};

const IconButtons: React.FC<IconButtonsProps> = ({ setShowColorReducer,setShowTextControl,setShowShapeControl }) => {
  return (
    <div className={styles.iconbuttons}>
      {/* カラーフィルタボタン */}
      <button
        className={styles.iconbutton}
        onClick={() => setShowColorReducer((prev) => !prev)} // トグル機能
        title="Apply Color Filter"
      >
        <IoColorFilterSharp size={60} color={'#ffff'}/>
      </button>

      {/* 長方形グループボタン */}
      <button
        className={styles.iconbutton}
        onClick={() => setShowShapeControl((prev) => !prev)} // トグル機能
        title="Group Rectangles"
      >
        <HiMiniRectangleGroup size={60} color={'#ffff'}/>
      </button>

      {/* テキスト編集ボタン */}
      <button
        className={styles.iconbutton}
        onClick={() => setShowTextControl((prev) => !prev)} // トグル機能
        title="Edit Text"
      >
        <PiTextAaFill size={60} color={'#ffff'} />
      </button>
    </div>
  );
};

export default IconButtons;
