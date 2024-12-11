"use client";

import React, { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import applyAnimeStyle from "./components/animeStyle";
import applySepiaStyle from "./components/SepiaStyle";

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
    <div style={{ textAlign: "center" }}>
      <h1>画像処理アプリ</h1>
      <ImageUpload onImageUpload={handleImageUpload} />
      <div style={{ marginTop: "20px" }}>
        {processedImage && (
          <>
            <img src={processedImage} alt="処理済み画像" style={{ maxWidth: "100%" }} />
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleAnimeStyle}>アニメ風に変換</button>
              <button onClick={handleSepiaStyle}>セピア風に変換</button>
            </div>
          </>
        )}
        {animeImage && (
          <img src={animeImage} alt="アニメ風画像" style={{ maxWidth: "100%", marginTop: "10px" }} />
        )}
        {sepiaImage && (
          <img src={sepiaImage} alt="セピア風画像" style={{ maxWidth: "100%", marginTop: "10px" }} />
        )}
      </div>
      
    </div>
  );
};

export default App;
