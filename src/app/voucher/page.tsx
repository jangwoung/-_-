"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "../components/modal";
import { generateLocationText } from "../textGenerator/generateText";

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../lib/firebase/config";
import Image from "next/image";
import Link from "next/link";

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
    description: "",
  });
  const [remainingTime, setRemainingTime] = useState<string>("24:00:00");

  useEffect(() => {
    const TOTAL_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Retrieve stored timer information
    const storedTimerStart = localStorage.getItem("voucherTimerStart");
    const storedRemainingTime = localStorage.getItem("voucherRemainingTime");
    const currentTime = new Date().getTime();

    let startTime: number;
    let remainingTimeMs: number;

    if (storedTimerStart && storedRemainingTime) {
      // If both start time and remaining time are stored
      startTime = parseInt(storedTimerStart, 10);
      remainingTimeMs = parseInt(storedRemainingTime, 10);

      // Adjust remaining time based on elapsed time since last save
      const elapsedSinceLastSave = currentTime - startTime;
      remainingTimeMs = Math.max(0, remainingTimeMs - elapsedSinceLastSave);
    } else {
      // If no previous timer exists, start a new 24-hour timer
      startTime = currentTime;
      remainingTimeMs = TOTAL_DURATION;

      // Store initial timer information
      localStorage.setItem("voucherTimerStart", startTime.toString());
      localStorage.setItem("voucherRemainingTime", remainingTimeMs.toString());
    }

    // Timer calculation function
    const calculateRemainingTime = () => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;
      const timeLeft = Math.max(0, remainingTimeMs - elapsedTime);

      if (timeLeft > 0) {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        // Update state and localStorage
        setRemainingTime(formattedTime);
        localStorage.setItem("voucherRemainingTime", timeLeft.toString());
      } else {
        // Timer has expired
        setRemainingTime("00:00:00");
        localStorage.removeItem("voucherTimerStart");
        localStorage.removeItem("voucherRemainingTime");
      }
    };

    // Initial calculation
    calculateRemainingTime();

    // Set up interval to update timer every second
    const timerId = setInterval(calculateRemainingTime, 1000);

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
      const text = await generateLocationText("北九州市");
      setLocationText(text);
    };

    loadImage();
    loadLocationText();

    // Cleanup function
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="text-center flex flex-col items-center bg-white min-h-svh">
      <Modal isOpened={isOpened} setIsOpened={setIsOpened}>
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="mt-8 mb-2 font-bold text-2xl">入場料割引！</h1>
          <h1 className="font-bold text-3xl text-red-600">
            ￥２００引きクーポン
          </h1>
          <h1 className="font-bold text-xl text-green-dark">
            有効期限：{remainingTime}
          </h1>
          <p>入場の際にこちらの画面をご提示ください。</p>
        </div>
      </Modal>

      {/* Rest of the component remains the same */}
      <div className="mt-16 text-xl text-base-black font-bold">
        <p>私は</p>
        <h1 className="flex justify-center items-end text-4xl mt-1 mb-4">
          「{locationText.descriptor}北九州市」
        </h1>
        <p>の観光大臣！</p>
      </div>

      {/* Image display */}
      <div className="mt-8">
        <div className="bg-green-light w-[420px] h-[40vh] flex justify-center items-center">
          {imageURL ? (
            <Image
              src={imageURL}
              width={300}
              height={300}
              alt="Latest Image"
              className="w-[360px] h-auto object-cover rounded-md"
            />
          ) : (
            <p>画像を読み込んでいます...</p>
          )}
        </div>
      </div>

      <article className="mt-8 w-[400px]">
        <h1 className="text-2xl font-bold">「{locationText.dialect}」</h1>
        <p className="text-wrap mt-2">{locationText.description}</p>
      </article>

      <div className="fixed bottom-10">
        <button
          className="py-4 px-8 mr-4 mt-20 rounded-xl bg-green-light text-xl text-white font-bold"
          onClick={() => setIsOpened(true)}
        >
          割引券を表示
        </button>

        <Link
          href={"/view"}
          className="py-4 px-8 mt-20 rounded-xl bg-yellow text-xl text-base-black font-bold"
        >
          トップへ
        </Link>
      </div>
    </div>
  );
}
