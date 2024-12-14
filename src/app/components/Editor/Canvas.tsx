import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image, Text, Rect, Transformer } from "react-konva";
import 'konva/lib/shapes/Path';
import Konva from 'konva';
import styles from "./styles/canvas.module.css";
import { ObjectProps } from "./Object/types";
import ColorReducer from "./Function/ColorReducer";

type CanvasProps = {
  image: HTMLImageElement | undefined;
  objects: ObjectProps[];
  setObjects: React.Dispatch<React.SetStateAction<ObjectProps[]>>;
};

const Canvas: React.FC<CanvasProps> = ({ image, objects, setObjects }) => {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | undefined>(undefined); 
  const [imageUploaded, setImageUploaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [selectedShape, setSelectedShape] = useState<ObjectProps | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [imageLayer, setImageLayer] = useState<Konva.Image | null>(null);
  const [stageWidth, setStageWidth] = useState(window.innerWidth);
  const [reducedImage, setReducedImage] = useState<HTMLImageElement | undefined>(undefined); // 修正: undefined に変更

////
const stageHeight = stageWidth * 0.75;

useEffect(() => {
  const handleResize = () => {
    setStageWidth(window.innerWidth);
  };
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

const getImageSize = () => {
  if (!image) return { width: 0, height: 0 };

  const stageAspectRatio = stageWidth / stageHeight;
  const imageAspectRatio = image.width / image.height;

  let newWidth, newHeight;

  if (imageAspectRatio > stageAspectRatio) {
    newWidth = stageWidth * 0.8;
    newHeight = newWidth / imageAspectRatio;
  } else {
    newHeight = stageHeight * 0.8;
    newWidth = newHeight * imageAspectRatio;
  }

  return { width: newWidth, height: newHeight };
};

const resizedImage = getImageSize();


/* 
  // 画像のアップロード処理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setUploadedImage(img);
        setImageUploaded(true);

        const ratio = img.height / img.width;
        setAspectRatio(ratio);

        setObjects((prev) => [
          ...prev,
          { id: prev.length + 1, type: "image", x: 100, y: 100, image: img },
        ]);
      };
    }
  };
*/
  // 長方形クリック時のハンドラ
  const handleShapeClick = (obj: ObjectProps, event: Konva.KonvaEventObject<MouseEvent>) => {
    const shape = event.target;
    setSelectedShape(obj);

    // トランスフォーマーの設定
    const transformer = transformerRef.current;
    if (transformer) {
      transformer.nodes([shape]);
      transformer.getLayer()?.batchDraw();
    }
  };

  // トランスフォーマーの外をクリックしたときの処理
  const handleStageClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    // クリックされた要素がステージ自体の場合のみ選択解除
    if (event.target === event.target.getStage()) {
      setSelectedShape(null);
      const transformer = transformerRef.current;
      if (transformer) {
        transformer.nodes([]);
        transformer.getLayer()?.batchDraw();
      }
    }
  };

  // リサイズ中のハンドラ
  const handleTransform = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const shape = event.target;
    const scaleX = shape.scaleX();
    const scaleY = shape.scaleY();

    if (selectedShape) {
      setObjects((prev) => 
        prev.map((obj) => 
          obj.id === selectedShape.id 
            ? { 
                ...obj, 
                width: obj.width! * scaleX, 
                height: obj.height! * scaleY,
                x: shape.x(),
                y: shape.y()
              } 
            : obj
        )
      );

      // スケールをリセット
      shape.scaleX(1);
      shape.scaleY(1);
    }
  };

  return (
    <div>
      <Stage 
        width={300} 
        height={300} 
        ref={stageRef}
        onClick={handleStageClick}
      >
        <Layer>
          {(reducedImage ||uploadedImage) && (
           <Image
           image={reducedImage || image} // image が undefined の場合でも動作するように修正
           width={resizedImage.width}
           height={resizedImage.height}
           x={(stageWidth - resizedImage.width) / 2}
           y={(stageHeight - resizedImage.height) / 2}
         />
          )}

          
          {/* 長方形の描画 */}
          {objects.map((obj) =>
            obj.type === "shape" ? (
              <Rect
                key={obj.id}
                x={obj.x}
                y={obj.y}
                width={obj.width!}
                height={obj.height!}
                fill={obj.fill}
                stroke={obj.stroke}
                draggable
                onClick={(event) => handleShapeClick(obj, event)}
                onDragEnd={(e) => {
                  setObjects((prev) =>
                    prev.map((o) =>
                      o.id === obj.id
                        ? { ...o, x: e.target.x(), y: e.target.y() }
                        : o
                    )
                  );
                }}
              />
            ) : null
          )}

          {/* トランスフォーマー */}
          <Transformer
              ref={transformerRef}
              anchorSize={20}
              anchorCornerRadius={10}
              enabledAnchors={selectedShape?.type === 'shape' ? ['middle-right', 'bottom-center'] : []}
              boundBoxFunc={(oldBox, newBox) => {
                // リサイズ範囲を制限したい場合はここで調整
                return newBox;
              }}
              onTransform={(e) => {
                const shape = e.target;
                const newAttrs = shape.getAttrs();
                const { width, height } = newAttrs;
                
                if (selectedShape) {
                  setObjects((prev) =>
                    prev.map((obj) =>
                      obj.id === selectedShape.id
                        ? { 
                            ...obj,
                            width: obj.type === 'shape' && newAttrs.width ? width : obj.width,
                            height: obj.type === 'shape' && newAttrs.height ? height : obj.height,
                          }
                        : obj
                    )
                  );
                }
              }}
            />

            {/* テキストの描画 */}
          {objects.map((obj) =>
            obj.type === "text" ? (
              <Text
                key={obj.id}
                text={obj.text}
                fontSize={obj.fontSize}
                fill={obj.fill}
                fontFamily={obj.fontFamily}
                x={obj.x}
                y={obj.y}
                draggable
                onDragEnd={(e) => {
                  setObjects((prev) =>
                    prev.map((o) =>
                      o.id === obj.id
                        ? { ...o, x: e.target.x(), y: e.target.y() }
                        : o
                    )
                  );
                }}
              />
            ) : null
          )}


        </Layer>
      </Stage>

    </div>
  );
};

export default Canvas;