"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "../components/modal";
//import { generateLocationText } from "../textGenerator/generateText";

export default function Voucher() {
  const [isOpened, setIsOpened] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [locationText, setLocationText] = useState({
    descriptor: "・・・",
    dialect: "・・・",
    description: "　"
  });

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get-latest-image');
        const data = await response.json();
        
        if (data.success) {
          setImagePath(data.imagePath);
        } else {
          console.error("画像の取得に失敗しました");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };
/*
    const loadLocationText = async () => {
      const text = await generateLocationText("福岡");
      setLocationText(text);
    };

    
    loadLocationText();*/
    fetchImage();
  }, []);

  return (
    <div className="text-center flex flex-col items-center bg-white min-h-svh">
      <Modal isOpened={isOpened} setIsOpened={setIsOpened}>
        <div>
          <h1 className="mt-8 mb-2 font-bold text-2xl">×××</h1>
          <h2 className="mb-8 font-bold text-3xl">￥XXX引き</h2>
          <div className="w-[320px] h-[320px] rounded-md shadow-lg"></div>
        </div>
      </Modal>

      <div className="mt-16 text-xl text-base-black font-bold ">
        <p>私は</p>
        <h1 className="flex justify-center items-end text-4xl mt-1 mb-4">
          「{locationText.descriptor}」
        </h1>
        <p>の観光大臣！</p>
      </div>

      {/* 写真表示 */}
      <div className="mt-8 w-[400px] h-[300px] shadow-lg bg-gray-400">
        {imagePath ? (
          <img 
            src={`http://localhost:5000${imagePath}`} 
            alt="Latest Image"  
            className="w-full h-full object-cover rounded-md" 
          />
        ) : (
          <p>画像を読み込んでいます...</p>
        )}
      </div>

      <article className="mt-8 w-[400px]">
        <h1 className="text-2xl font-bold">「{locationText.dialect}」</h1>
        <p className="text-wrap mt-2">{locationText.description}</p>
      </article>

      <button
        className="py-4 px-8 mt-20 rounded-xl bg-green-light text-xl text-white font-bold"
        onClick={() => setIsOpened(true)}
      >
        割引券を表示
      </button>
    </div>
  );
}