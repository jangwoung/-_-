"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("カメラの初期化に失敗しました:", err);
    }
  };

  useEffect(() => {
    initializeCamera();

    // コンポーネントがアンマウントされたときにカメラを停止
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        const width = videoRef.current.videoWidth;
        const height = (width * 4) / 3;

        canvas.width = width;
        canvas.height = height;

        const sx = 0;
        const sy = (videoRef.current.videoHeight - height) / 2;

        context.drawImage(
          videoRef.current,
          sx,
          sy,
          width,
          height,
          0,
          0,
          width,
          height
        );

        const dataURL = canvas.toDataURL("image/png");
        setPhoto(dataURL);

        console.log(dataURL);
      }
    }
  };

  const resetCamera = () => {
    setPhoto(null); // 撮影した画像をリセット
    initializeCamera(); // カメラを再初期化
  };

  return (
    <div className="relative w-full h-screen bg-green-dark overflow-hidden">
      {!photo ? (
        <div>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full pt-24 aspect-[3/4] object-cover"
            playsInline
          />
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
            <button
              onClick={takePhoto}
              className="bg-green-light w-20 h-20 rounded-full flex justify-center items-center"
            >
              <div className="bg-black w-[72px] h-[72px] rounded-full flex justify-center items-center">
                <div className="bg-green-light w-16 h-16 rounded-full"></div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* 撮影した画像を表示 */}
          <Image
            src={photo}
            width={400}
            height={300}
            alt="Captured"
            className="w-full h-auto object-contain"
          />
          <button
            onClick={resetCamera}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            戻る
          </button>
        </div>
      )}
    </div>
  );
}
