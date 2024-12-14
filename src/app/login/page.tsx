"use client";

import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

import { auth, provider } from "../../../lib/firebase/config";
import { signInWithPopup } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";

import GoogleLogo from "../../../public/img/icon/G-logo.png";
import Image from "next/image";

export default function Login() {
  const router = useRouter();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      console.log(result);
      router.push("/camera");
    });
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      redirect("/camera");
    }
  });

  return (
    <div className="text-center flex flex-col justify-center items-center">
      <div className="mt-[20vh] text-lg text-white font-bold">
        <p>私が！？</p>
        <h1 className="flex justify-center text-6xl mt-1 mb-2">
          「市<p>か</p>区」
        </h1>
        <p>の観光大臣！</p>
      </div>

      <button
        className="fixed top-[60vh] flex justify-center items-center w-[320px] h-[64px] bg-white rounded-2xl shadow-xl"
        onClick={signInWithGoogle}
      >
        <>
          <Image src={GoogleLogo} alt="Google logo" width={36} />
          <h1 className="font-bold text-2xl ml-3 pb-1">Googleで始める</h1>
        </>
      </button>
    </div>
  );
}
