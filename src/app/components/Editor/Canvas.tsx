import React, { useEffect, useState } from "react";
import { Stage, Layer, Text, Image } from "react-konva";
import styles from "./styles/canvas.module.css";
import ColorReducer from "./ColorReducer";

type TextProps = {
  text: string;
  fontSize: number;
  fill: string;
  fontFamily: string;
  x: number;
  y: number;
};

type CanvasProps = {
  image: HTMLImageElement | undefined;  // 修正: HTMLImageElement | undefined
  textProps: TextProps;
  setTextProps: React.Dispatch<React.SetStateAction<TextProps>>;
};

const Canvas: React.FC<CanvasProps> = ({ image, textProps, setTextProps }) => {
  const [stageWidth, setStageWidth] = useState(window.innerWidth);
  const [reducedImage, setReducedImage] = useState<HTMLImageElement | undefined>(undefined); // 修正: undefined に変更

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

  return (
    <div className={styles.stagecontainer}>
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {(reducedImage || image) && (
            <Image
              image={reducedImage || image} // image が undefined の場合でも動作するように修正
              width={resizedImage.width}
              height={resizedImage.height}
              x={(stageWidth - resizedImage.width) / 2}
              y={(stageHeight - resizedImage.height) / 2}
            />
          )}
          <Text
            {...textProps}
            draggable
            onDragEnd={(e) => {
              const { x, y } = e.target.position();
              setTextProps((prev) => ({ ...prev, x, y }));
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;
