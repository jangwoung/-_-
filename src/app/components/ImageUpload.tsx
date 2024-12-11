"use client";

import React, { useState } from "react";

type ImageUploadProps = {
  onImageUpload: (image: Blob) => void; // 画像アップロード時のコールバック関数
};

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert("画像を選択してください");
      return;
    }

    onImageUpload(selectedImage); // 親コンポーネントに画像を渡す
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && (
        <button onClick={handleUpload} style={{ marginTop: "10px" }}>
          アップロード
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
