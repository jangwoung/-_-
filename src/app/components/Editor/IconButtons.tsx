import React from "react";
import styles from "./styles/canvas.module.css";
import { IoColorFilterSharp } from "react-icons/io5"; // カラーフィルタアイコン
import { PiTextAaFill } from "react-icons/pi"; // テキスト編集アイコン
import { HiMiniRectangleGroup } from "react-icons/hi2"; // 長方形グループアイコン

type IconButtonsProps = {
  setShowColorReducer: React.Dispatch<React.SetStateAction<boolean>>; // ColorReducerの表示を制御する関数
};

const IconButtons: React.FC<IconButtonsProps> = ({ setShowColorReducer }) => {
  return (
    <div className={styles.iconbuttons}>
      {/* カラーフィルタボタン */}
      <button
        className={styles.iconbutton}
        onClick={() => setShowColorReducer(true)} // カラーフィルタ表示
        title="Apply Color Filter"
      >
        <IoColorFilterSharp />
      </button>

      {/* テキスト編集ボタン */}
      <button
        className={styles.iconbutton}
        //onClick={editText}
        title="Edit Text"
      >
        <PiTextAaFill />
      </button>

      {/* 長方形グループボタン */}
      <button
        className={styles.iconbutton}
        //onClick={groupRectangles}
        title="Group Rectangles"
      >
        <HiMiniRectangleGroup />
      </button>
    </div>
  );
};

export default IconButtons;
