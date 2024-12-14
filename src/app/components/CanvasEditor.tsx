import React, { useState } from "react";
import Canvas from "./Editor/Canvas";
import ImageUploader from "./Editor/ImageUploader";
import TextControls from "./Editor/Function/TextControls";
import useImage from "use-image";
import IconButtons from "./Editor/IconButtons";
import ColorReducer from "./Editor/Function/ColorReducer";
import ShapeControls from "./Editor/Function/ShapeControls";
import Sidebar from "./Editor/Sidebar";
import styles from "./Editor/styles/canvas.module.css";
import { ObjectProps } from "./Editor/Object/types";

const defaultTextProps = {
  text: "Hello World",
  fontSize: 20,
  fill: "#000000",
  fontFamily: "Arial",
  x: 50,
  y: 50,
};

type ShapeProps = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

const CanvasEditor = () => {
  const [textProps, setTextProps] = useState(defaultTextProps);
  const [objects, setObjects] = useState<ObjectProps[]>([]);
  const [shapes, setShapes] = useState<ShapeProps[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [image] = useImage(imageUrl || "");
  const [showColorReducer, setShowColorReducer] = useState(false);
  const [showTextControl, setShowTextControl] = useState(false);
  const [showShapeControl, setShowShapeControl] = useState(false);
  const [reducedImage, setReducedImage] = useState<HTMLImageElement | undefined>(undefined);

  const handleColorReduction = (image: HTMLImageElement) => {
    setReducedImage(image); // 親コンポーネントで新しい画像を管理
  };
  

  return (
    <div className="editor">
      <div className="controls">
      </div>   
      <ImageUploader setImageUrl={setImageUrl} />   
      <IconButtons 
        setShowColorReducer={setShowColorReducer} 
        setShowTextControl={setShowTextControl}
        setShowShapeControl={setShowShapeControl}
      />
      <div className={styles.CunvasBack}>
      
      {/* キャンバス */}
      <Canvas image={reducedImage || image}  objects={objects} setObjects={setObjects} />
      {/* サイドバー */}
      <Sidebar objects={objects} setObjects={setObjects} />

      </div>

      {/*状態変数による関数呼び出し */}
      {showColorReducer && (
        <ColorReducer image={image} onColorReduced={handleColorReduction} />
      )}
      {showTextControl && (
        <TextControls setObjects={setObjects} />
      )}
      {showShapeControl && (
        <ShapeControls setObjects={setObjects} /> 
      )}
    </div>
  );
};

export default CanvasEditor;
