"use client";

import React, { useState } from "react";

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setProcessedImage(null); // 新しい画像選択時に処理結果をリセット
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("画像を選択してください");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:5000/process-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProcessedImage(imageUrl); // 処理結果を表示
      } else {
        alert("画像処理に失敗しました");
      }
    } catch (error) {
      console.error("エラー:", error);
      alert("サーバーとの通信に問題が発生しました");
    }
  };

  const handleReset = () => {
    setSelectedImage(null); // 選択した画像をリセット
    setProcessedImage(null); // 処理結果をリセット
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>画像処理アプリ</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div style={{ margin: "20px" }}>
        {selectedImage && (
          <button onClick={handleUpload} style={{ marginRight: "10px" }}>
            アップロード
          </button>
        )}
        <button onClick={handleReset} style={{ backgroundColor: "red", color: "white" }}>
          リセット
        </button>
      </div>
      <div>
        {processedImage && <img src={processedImage} alt="処理済み画像" style={{ maxWidth: "100%" }} />}
      </div>
    </div>
  );
};

export default ImageUpload;
