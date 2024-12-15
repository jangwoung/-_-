"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase/config";

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentVideoRef = videoRef.current;
    let currentStream: MediaStream | null = null;

    const initializeCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        streamRef.current = stream;
        currentStream = stream;

        if (currentVideoRef) {
          currentVideoRef.srcObject = stream;

          const playPromise = currentVideoRef.play();

          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Error playing video:", error);
              setIsLoading(false);
            });
          }

          currentVideoRef.onloadedmetadata = () => {
            setIsLoading(false);
          };
        }
      } catch (err) {
        console.error("カメラの初期化に失敗しました:", err);
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        initializeCamera();
      } else {
        redirect("/login");
      }
    });

    return () => {
      unsubscribe();

      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
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
    setPhoto(null);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white">カメラを読み込んでいます...</p>
            </div>
          )}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full pt-24 aspect-[3/4] object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden"></canvas>
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
            <button
              onClick={takePhoto}
              disabled={isLoading}
              className="bg-green-light w-20 h-20 rounded-full flex justify-center items-center disabled:opacity-50"
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
            onClick={resetCamera}
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
