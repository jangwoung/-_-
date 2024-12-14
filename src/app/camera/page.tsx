"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();

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
      }
    }
  };

  const sendImage = async () => {
    if (photo) {
      const blob = await fetch(photo).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "captured.png");

      try {
        const response = await fetch("http://localhost:5000/process-image", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const result = await response.blob();
          const resultURL = URL.createObjectURL(result);
          router.push(`/sinthesisImage?image=${encodeURIComponent(resultURL)}`);
        } else {
          console.error("画像処理に失敗しました:", await response.text());
        }
      } catch (err) {
        console.error("エラーが発生しました:", err);
      }
    }
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
          <Image
            src={photo}
            width={400}
            height={300}
            alt="Captured"
            className="w-full h-auto object-contain"
          />
          <button
            onClick={initializeCamera}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            戻る
          </button>
          <button
            onClick={sendImage}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
