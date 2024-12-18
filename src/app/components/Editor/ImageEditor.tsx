"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Transformer,
  Rect,
  Text,
} from "react-konva";
import { Image as ImageType } from "konva/lib/shapes/Image";
import { ObjectProps } from "./Object/types";
import Konva from "konva";

interface ImageEditorProps {
  imageUrl: string;
  objects: ObjectProps[];
  setObjects: React.Dispatch<React.SetStateAction<ObjectProps[]>>;
  stageRef: React.RefObject<Konva.Stage>;
  reductionLevel: number;
}

const ImageEditor = ({
  imageUrl,
  objects,
  setObjects,
  stageRef,
  reductionLevel,
}: ImageEditorProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<HTMLImageElement | null>(
    null
  );
  const imageRef = useRef<ImageType>(null);
  const transformerRef = useRef<any>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);

  // 減色処理関数
  const reduceColors = (
    imageElement: HTMLImageElement,
    levels: number
  ): HTMLImageElement => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas context not available");

    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    ctx.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 分割幅を計算
    const step = 255 / (levels - 1);

    for (let i = 0; i < data.length; i += 4) {
      // 各チャンネルを最も近いレベルにマッピング
      data[i] = Math.round(data[i] / step) * step; // Red
      data[i + 1] = Math.round(data[i + 1] / step) * step; // Green
      data[i + 2] = Math.round(data[i + 2] / step) * step; // Blue
    }

    ctx.putImageData(imageData, 0, 0);

    const reducedImage = new Image();
    reducedImage.src = canvas.toDataURL();
    return reducedImage;
  };

  // 画像読み込み時の処理
  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
      // 初期状態で元の画像を設定
      setProcessedImage(img);
    };
  }, [imageUrl]);

  // 減色レベルが変更された時の処理
  useEffect(() => {
    if (image) {
      // 画像を減色処理
      const reduced = reduceColors(image, reductionLevel);
      reduced.onload = () => {
        setProcessedImage(reduced);
      };
    }
  }, [reductionLevel, image]);

  //以下画像の大きさについて

  const handleSelect = () => {
    setIsSelected(true);
  };

  const handleObjectClick = (obj: ObjectProps) => {
    setSelectedObjectId(obj.id);
  };

  const handleStageClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    // クリックされたオブジェクトがない場合、選択を解除
    const clickedOnEmpty = event.target === event.target.getStage();
    if (clickedOnEmpty) {
      setSelectedObjectId(null);
    }
  };

  const handleDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setIsSelected(false);
    }
  };

  const handleTransform = () => {
    if (imageRef.current) {
      const node = imageRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      const rotation = node.rotation();
      const x = node.x();
      const y = node.y();
      const width = node.width() * scaleX;
      const height = node.height() * scaleY;

      setObjects((prevObjects) => {
        const updatedObjects = [...prevObjects];
        const imageIndex = updatedObjects.findIndex(
          (obj) => obj.type === "image"
        );

        const imageObject: ObjectProps = {
          id:
            imageIndex !== -1
              ? updatedObjects[imageIndex].id
              : prevObjects.length + 1,
          type: "image",
          x,
          y,
          width,
          height,
          rotation,
          image: image || undefined,
        };

        if (imageIndex !== -1) {
          updatedObjects[imageIndex] = imageObject;
        } else {
          updatedObjects.push(imageObject);
        }

        return updatedObjects;
      });
    }
  };

  const exportToImage = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      return dataURL;
    }
    return null;
  };

  return (
    <Stage
      width={300}
      height={300}
      onMouseDown={handleDeselect}
      onClick={handleStageClick}
      ref={stageRef}
    >
      <Layer>
        {processedImage && (
          <>
            <KonvaImage
              ref={imageRef}
              image={processedImage}
              x={0}
              y={0}
              width={260}
              height={260}
              draggable
              onClick={handleSelect}
              onTap={handleSelect}
              onTransform={handleTransform}
              onDragEnd={handleTransform}
            />

            {isSelected && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
                nodes={imageRef.current ? [imageRef.current] : []}
              />
            )}
          </>
        )}

        {/* 長方形の描画 */}
        {/* 長方形の描画 */}
        {objects.map((obj) =>
          obj.type === "shape" ? (
            <React.Fragment key={obj.id}>
              <Rect
                x={obj.x}
                y={obj.y}
                width={obj.width!}
                height={obj.height!}
                fill={obj.fill}
                stroke={obj.stroke}
                draggable
                onClick={() => handleObjectClick(obj)} // これを追加
                ref={(node) => {
                  if (node) {
                    node.id(obj.id.toString());
                  }
                }}
                onDragEnd={(e) => {
                  setObjects((prev) =>
                    prev.map((o) =>
                      o.id === obj.id
                        ? { ...o, x: e.target.x(), y: e.target.y() }
                        : o
                    )
                  );
                }}
                onTransform={(e) => {
                  const node = e.target;
                  setObjects((prev) =>
                    prev.map((o) =>
                      o.id === obj.id
                        ? {
                            ...o,
                            x: node.x(),
                            y: node.y(),
                            width: node.width() * node.scaleX(),
                            height: node.height() * node.scaleY(),
                            rotation: node.rotation(),
                          }
                        : o
                    )
                  );
                }}
              />
              {selectedObjectId === obj.id && (
                <Transformer
                  nodes={[stageRef.current?.findOne(`#${obj.id}`)].filter(
                    Boolean
                  )}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </React.Fragment>
          ) : null
        )}

        {/* テキストの描画 */}
        {objects.map((obj) =>
          obj.type === "text" ? (
            <React.Fragment key={obj.id}>
              <Text
                text={obj.text}
                fontSize={obj.fontSize}
                fill={obj.fill}
                fontFamily={obj.fontFamily}
                x={obj.x}
                y={obj.y}
                draggable
                onClick={() => handleObjectClick(obj)} // これを追加
                ref={(node) => {
                  if (node) {
                    node.id(obj.id.toString());
                  }
                }}
                onDragEnd={(e) => {
                  setObjects((prev) =>
                    prev.map((o) =>
                      o.id === obj.id
                        ? { ...o, x: e.target.x(), y: e.target.y() }
                        : o
                    )
                  );
                }}
                onTransform={(e) => {
                  const node = e.target;
                  setObjects((prev) =>
                    prev.map((o) =>
                      o.id === obj.id
                        ? {
                            ...o,
                            x: node.x(),
                            y: node.y(),
                            rotation: node.rotation(),
                          }
                        : o
                    )
                  );
                }}
              />
              {selectedObjectId === obj.id && (
                <Transformer
                  nodes={[stageRef.current?.findOne(`#${obj.id}`)].filter(
                    Boolean
                  )}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </React.Fragment>
          ) : null
        )}
      </Layer>
    </Stage>
  );
};

export default ImageEditor;
