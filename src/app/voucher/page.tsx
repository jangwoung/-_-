"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "../components/modal";
import { generateLocationText } from "../textGenerator/generateText";

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../lib/firebase/config";

const fetchDownloadURL = async (storagePath: string): Promise<string> => {
  const storageRef = ref(storage, storagePath);
  return await getDownloadURL(storageRef);
};

export default function Voucher() {
  const [isOpened, setIsOpened] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [locationText, setLocationText] = useState({
    descriptor: "・・・",
    dialect: "・・・",
    description: "　",
  });

  useEffect(() => {
    // Load image from Firebase Storage
    const loadImage = async () => {
      const sessionImagePath = sessionStorage.getItem("imageURL");

      if (sessionImagePath) {
        try {
          const downloadURL = await fetchDownloadURL(sessionImagePath);
          setImageURL(downloadURL); // Set the resolved URL to state
        } catch (error) {
          console.error("Failed to fetch image URL from Firebase:", error);
        }
      } else {
        console.error("No image path found in sessionStorage");
      }
    };

    // Load location text
    const loadLocationText = async () => {
      const text = await generateLocationText("福岡");
      setLocationText(text);
    };

    loadImage();
    loadLocationText();
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

      <div className="mt-16 text-xl text-base-black font-bold">
        <p>私は</p>
        <h1 className="flex justify-center items-end text-4xl mt-1 mb-4">
          「{locationText.descriptor}」
        </h1>
        <p>の観光大臣！</p>
      </div>

      {/* Image display */}
      <div className="mt-8 w-[400px] h-[300px] shadow-lg bg-gray-400">
        {imageURL ? (
          <img
            src={imageURL} // Use the resolved URL here
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
