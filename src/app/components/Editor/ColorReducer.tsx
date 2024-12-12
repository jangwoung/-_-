import React, { useState, useRef, useEffect } from "react";

type ColorReducerProps = {
  image: HTMLImageElement | undefined;  // 修正: HTMLImageElement | undefined
  onColorReduced: (image: HTMLImageElement) => void;
};

const ColorReducer: React.FC<ColorReducerProps> = ({ image, onColorReduced }) => {
  const [colorCount, setColorCount] = useState(16);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (image && canvasRef.current) {
      applyColorReduction(colorCount);
    }
  }, [image, colorCount]);

  const applyColorReduction = (colors: number) => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const factor = 256 / colors;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / factor) * factor;
      data[i + 1] = Math.floor(data[i + 1] / factor) * factor;
      data[i + 2] = Math.floor(data[i + 2] / factor) * factor;
    }

    ctx.putImageData(imageData, 0, 0);

    // 新しい画像を生成
    const reducedImage = new Image();
    reducedImage.src = canvas.toDataURL();
    reducedImage.onload = () => {
      // 親コンポーネントに新しい画像を渡す
      onColorReduced(reducedImage);
    };
  };

  return (
    <div>
      <input
        type="range"
        min="2"
        max="32"
        value={colorCount}
        onChange={(e) => setColorCount(Number(e.target.value))}
      />
      <span>Colors: {colorCount}</span>
      <canvas ref={canvasRef} style={{ display: "none" }} /> {/* canvasは表示しない */}
    </div>
  );
};

export default ColorReducer;
