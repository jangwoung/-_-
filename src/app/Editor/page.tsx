"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./editor.module.css";
import ImageUpload from "../components/ImageUpload";
import applyAnimeStyle from "../components/animeStyle";
import applySepiaStyle from "../components/SepiaStyle";
//import CanvasEditor from "../components/CanvasEditor";
import dynamic from "next/dynamic";

const CanvasEditor = dynamic(() => import("../components/CanvasEditor"), {
  ssr: false,
});

const App: React.FC = () => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [animeImage, setAnimeImage] = useState<string | null>(null);
  const [sepiaImage, setSepiaImage] = useState<string | null>(null);

  const handleImageUpload = async (image: Blob) => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/process-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProcessedImage(imageUrl); // 処理済み画像を設定
      } else {
        alert("画像処理に失敗しました");
      }
    } catch (error) {
      console.error("エラー:", error);
      alert("サーバーとの通信に問題が発生しました");
    }
  };

  const handleAnimeStyle = async () => {
    if (!processedImage) {
      alert("合成画像を生成してください");
      return;
    }

    try {
      const response = await fetch(processedImage); // 合成画像を取得
      const blob = await response.blob();
      const animeImageUrl = await applyAnimeStyle(blob);
      if (animeImageUrl) {
        setAnimeImage(animeImageUrl); // アニメ風変換された画像を表示
      } else {
        alert("アニメ風変換に失敗しました");
      }
    } catch (error) {
      console.error("エラー:", error);
      alert("アニメ風画像変換に問題が発生しました");
    }
  };

  const handleSepiaStyle = async () => {
    if (!processedImage) {
      alert("合成画像を生成してください");
      return;
    }

    try {
      // 合成画像をURLでなくBlobとして取得する
      const response = await fetch(processedImage); // 画像URLをフェッチ
      const blob = await response.blob(); // Blobに変換

      // セピア風に変換
      const sepiaImageUrl = await applySepiaStyle(blob); // applySepiaStyleがBlobを受け取る

      if (sepiaImageUrl) {
        setSepiaImage(sepiaImageUrl); // セピア風画像を表示
      } else {
        alert("セピア風変換に失敗しました");
      }
    } catch (error) {
      console.error("エラー:", error);
      alert("セピア風画像変換に問題が発生しました");
    }
  };

  return (
    <div className={styles.body}>
      <Link href="/">
        <button>本ページへ</button>
      </Link>
      <h1>画像編集アプリ</h1>
      <CanvasEditor />
    </div>
  );
};

export default App;
