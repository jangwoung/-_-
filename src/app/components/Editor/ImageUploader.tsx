import React from "react";

type ImageUploaderProps = {
  setImageUrl: (url: string | null) => void;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImageUrl }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return <input type="file" accept="image/*" onChange={handleFileChange} />;
};

export default ImageUploader;
