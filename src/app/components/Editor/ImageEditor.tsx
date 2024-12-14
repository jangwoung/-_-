"use client";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer, Rect, Text } from 'react-konva';
import { Image as ImageType } from 'konva/lib/shapes/Image';
import { ObjectProps } from "./Object/types";
import Konva from 'konva';
//関数
import {exportToImage} from"../utils/exportImage";
import { redirectToVoucher } from "../utils/redirectToVoucher";

interface ImageEditorProps {
  imageUrl: string;
  objects: ObjectProps[];
  setObjects: React.Dispatch<React.SetStateAction<ObjectProps[]>>;
  stageRef: React.RefObject<Konva.Stage>;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, objects,setObjects,stageRef }) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const imageRef = useRef<ImageType>(null);
  const transformerRef = useRef<any>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);


  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
    };
  }, [imageUrl]);

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
        const imageIndex = updatedObjects.findIndex(obj => obj.type === 'image');
        
        const imageObject: ObjectProps = {
          id: imageIndex !== -1 ? updatedObjects[imageIndex].id : prevObjects.length + 1,
          type: 'image',
          x,
          y,
          width,
          height,
          rotation,
          image: image || undefined
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
      width={260}
      height={260}
      onMouseDown={handleDeselect}
      onClick={handleStageClick} 
      ref={stageRef} 
    >
      <Layer>
        {image && (
          <>
            <KonvaImage
              ref={imageRef}
              image={image}
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
                    onClick={() => handleObjectClick(obj)}  // これを追加
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
                                rotation: node.rotation()
                            }
                            : o
                        )
                    );
                    }}
                 />
            {selectedObjectId === obj.id && (
                <Transformer
                nodes={[stageRef.current?.findOne(`#${obj.id}`)].filter(Boolean)}
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
                onClick={() => handleObjectClick(obj)}  // これを追加
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
                            rotation: node.rotation()
                        }
                        : o
                    )
                );
                }}
                />
            {selectedObjectId === obj.id && (
                <Transformer
                nodes={[stageRef.current?.findOne(`#${obj.id}`)].filter(Boolean)}
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