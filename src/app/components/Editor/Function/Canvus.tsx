import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Text, Rect, Transformer } from "react-konva";
import 'konva/lib/shapes/Path';
import Konva from 'konva';
interface CanvasProps {
  imageUrl: string; // 画像のURL（blob URL）
  objects: any[];
  setObjects: React.Dispatch<React.SetStateAction<any[]>>;
}

const Canvas: React.FC<CanvasProps> = ({ imageUrl, objects, setObjects }) => {
  const stageRef = useRef(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl; // そのまま設定
    img.onload = () => setImage(img); // 画像が読み込まれたらStateに保存
  }, [imageUrl]);
  

  const handleStageClick = (e: any) => {
    console.log("Stage clicked", e);
  };

  return (
    <div>
      <Stage
        width={800}
        height={600}
        ref={stageRef}
        onClick={handleStageClick}
      >
        <Layer>
          {/* KonvaImage コンポーネントに image プロパティを渡して画像を表示 */}
          {image && (
            <KonvaImage
              image={image}  // ここで HTMLImageElement を渡す
              x={0}
              y={0}
              width={800} // 画像の幅
              height={600} // 画像の高さ
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
