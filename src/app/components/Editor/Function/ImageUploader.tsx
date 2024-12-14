import React from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageFile: File) => void;
}

const ImageUploader = ({ onImageUpload }: { onImageUpload: (imageFile: File) => void }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleFileChange} 
    />
  );
};

export default ImageUploader;


