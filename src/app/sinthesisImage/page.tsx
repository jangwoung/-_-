"use client";

import { redirect } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SinthesisImage() {  
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  if (!imageUrl) return <p>画像が見つかりません。</p>;

  const handleRedirect = () => {
    // 画像URLをクエリパラメータとして渡して遷移
    redirect(`/editorImg?image=${encodeURIComponent(imageUrl)}`);
  };
  return (
    <div className="text-center flex flex-col justify-center">
      <div className="mt-[20vh] text-lg text-white font-bold">
        <p>作成中</p>
      </div>
      <div className="flex items-center justify-center h-screen">
        <Image src={imageUrl} width={400} height={300} alt="Processed Image" />
      </div>
      <button
        onClick={handleRedirect}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
      >
        編集する
      </button>
    </div>
  );
}
