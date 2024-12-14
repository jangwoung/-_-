"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

const CanvasEditor = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [image] = useImage(imageUrl || "");
  const [objects, setObjects] = useState<ObjectProps[]>([]);
  const [showColorReducer, setShowColorReducer] = useState(false);
  const [showTextControl, setShowTextControl] = useState(false);
  const [showShapeControl, setShowShapeControl] = useState(false);
  const [reducedImage, setReducedImage] = useState<HTMLImageElement | undefined>(undefined);

  const searchParams = useSearchParams();
  const imageUrlFromParams = searchParams.get("image");

  useEffect(() => {
    if (imageUrlFromParams) {
      setImageUrl(imageUrlFromParams);
    }
  }, [imageUrlFromParams]);

  const handleColorReduction = (image: HTMLImageElement) => {
    setReducedImage(image); // 親コンポーネントで新しい画像を管理
  };

  return (
    <div className="editor">
      <div className="controls"></div>
      <ImageUploader setImageUrl={setImageUrl} />
      <IconButtons
        setShowColorReducer={setShowColorReducer}
        setShowTextControl={setShowTextControl}
        setShowShapeControl={setShowShapeControl}
      />
      <div className={styles.CunvasBack}>
        {/* キャンバス */}
        <Canvas image={image} objects={objects} setObjects={setObjects} />
        {/* サイドバー */}
        <Sidebar objects={objects} setObjects={setObjects} />
      </div>

      {/* 状態変数による関数呼び出し */}
      {showColorReducer && <ColorReducer image={image} onColorReduced={handleColorReduction} />}
      {showTextControl && <TextControls setObjects={setObjects} />}
      {showShapeControl && <ShapeControls setObjects={setObjects} />}
    </div>
  );
};

export default CanvasEditor;
