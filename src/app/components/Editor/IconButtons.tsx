import React ,{useState}from "react";
import styles from "./styles/canvas.module.css";
import { IoColorFilterSharp } from "react-icons/io5"; // カラーフィルタアイコン
import { PiTextAaFill } from "react-icons/pi"; // テキスト編集アイコン
import { HiMiniRectangleGroup } from "react-icons/hi2"; // 長方形グループアイコン
import { FaStamp } from "react-icons/fa";

type IconButtonsProps = {
  setShowColorReducer: React.Dispatch<React.SetStateAction<boolean>>; 
  setShowTextControl: React.Dispatch<React.SetStateAction<boolean>>; 
  setShowShapeControl: React.Dispatch<React.SetStateAction<boolean>>; 
  
};

const IconButtons: React.FC<IconButtonsProps> = ({ setShowColorReducer,setShowTextControl,setShowShapeControl }) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div className={styles.iconbuttons}>
      {/* カラーフィルタボタン */}


      <div className={styles.name}>  
      <button
        className={styles.iconbutton}
        onClick={() =>  setShowColorReducer((prev) => !prev)}
        title="Apply Color Filter"
      >
        <IoColorFilterSharp size={40} color={'#ffff'}/></button>
        <div className="text-sm text-white ">
        <p>量子化</p>
      </div>
      </div>
      

      {/* 長方形グループボタン */}
      <div className={styles.name}>  
      <button
        className={styles.iconbutton}
        onClick={() => setShowShapeControl((prev) => !prev)} // トグル機能
        title="Group Rectangles"
      >
        <HiMiniRectangleGroup size={40} color={'#ffff'}/>
      </button>
      <div className="text-sm text-white ">
        <p>四角形</p>
      </div>
      </div>


      {/* テキスト編集ボタン */}
      <div className={styles.name}>  
      <button
        className={styles.iconbutton}
        onClick={() => setShowTextControl((prev) => !prev)} // トグル機能
        title="Edit Text"
      >
        <PiTextAaFill size={40} color={'#ffff'} />
      </button>
      <div className="text-sm text-white ">
        <p>テキスト</p>
      </div>
      </div>
    </div>
  );
};

export default IconButtons;
