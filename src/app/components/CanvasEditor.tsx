import React, { useState } from "react";
import Canvas from "./Editor/Canvas";
import ImageUploader from "./Editor/ImageUploader";
import TextControls from "./Editor/TextControls";
import useImage from "use-image";
import IconButtons from "./Editor/IconButtons";
import ColorReducer from "./Editor/ColorReducer"; // ColorReducerインポート

const defaultTextProps = {
  text: "Hello World",
  fontSize: 20,
  fill: "#000000",
  fontFamily: "Arial",
  x: 50,
  y: 50,
};

const CanvasEditor = () => {
  const [textProps, setTextProps] = useState(defaultTextProps);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [image] = useImage(imageUrl || "");
  const [showColorReducer, setShowColorReducer] = useState(false);
  const [reducedImage, setReducedImage] = useState<HTMLImageElement | undefined>(undefined);

  const handleColorReduction = (image: HTMLImageElement) => {
    setReducedImage(image); // 親コンポーネントで新しい画像を管理
  };

  return (
    <div className="editor">
      <div className="controls">
        <ImageUploader setImageUrl={setImageUrl} />
        <TextControls textProps={textProps} setTextProps={setTextProps} />
      </div>
      {/* imageが変動するたびにCanvasも更新される */}
      <Canvas image={reducedImage || image} textProps={textProps} setTextProps={setTextProps} />
      <IconButtons setShowColorReducer={setShowColorReducer} />
      
      {/* showColorReducerがtrueの場合にColorReducerを表示 */}
      {showColorReducer && image && (
        <ColorReducer image={image} onColorReduced={handleColorReduction} />
      )}
    </div>
  );
};

export default CanvasEditor;
