"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  getRedirectResult,
  getAuth,
} from "firebase/auth";
import { firebaseApp } from "../../../lib/FirebaseConfig";
import GoogleLogo from "../../../public/img/icon/G-logo.png";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = firebaseApp ? getAuth(firebaseApp) : null;

  useEffect(() => {
    const handleRedirectResult = async () => {
      if (!auth) return;

      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          router.push("/");
        }
      } catch (error) {
        console.error("Redirect result error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "認証中にエラーが発生しました"
        );
      }
    };

    handleRedirectResult();
  }, [router, auth]);

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError("Firebaseの初期化に失敗しました");
      return;
    }

    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(
        error instanceof Error ? error.message : "ログインに失敗しました"
      );
      setIsLoading(false);
    }
  };

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
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="text-gray-500">認証中...</span>
        ) : (
          <>
            <Image src={GoogleLogo} alt="Google logo" width={36} />
            <h1 className="font-bold text-2xl ml-3 pb-1">Googleで始める</h1>
          </>
        )}
      </button>

      {error && <div className="text-red-500 mt-4">エラー: {error}</div>}
    </div>
  );
}
