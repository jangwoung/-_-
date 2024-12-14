"use client";

import { redirect } from "next/navigation";

export default function Start() {
  const handleRedirect = () => {
    redirect("/camera");
  };

  return (
    <div className="text-center flex flex-col justify-center">
      <div className="mt-[20vh] text-lg text-white font-bold ">
        <p>私が！？</p>
        <h1 className="flex justify-center items-end text-6xl mt-1 mb-2">
          「市<p className="text-3xl">か</p>区」
        </h1>
        <p>の観光大臣！</p>
      </div>

      <div
        className="fixed top-0 w-screen sm:w-[420px] min-h-svh"
        onClick={handleRedirect}
      >
        <h1 className="mt-[60vh] font-bold text-2xl text-yellow animate-bounce">
          タップで始める
        </h1>
      </div>
    </div>
  );
}
