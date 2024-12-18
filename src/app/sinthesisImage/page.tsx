"use client";

import { redirect } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function SinthesisImage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  const today = new Date();
  const formattedDate = `${today.getFullYear()}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

  if (!imageUrl) return <p>画像が見つかりません。</p>;

  const handleRedirect = () => {
    redirect(`/editorImg?image=${encodeURIComponent(imageUrl)}`);
  };

  return (
    <div className="text-center flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full h-[72vh] pb-10 mt-20 bg-white">
        <Image src={imageUrl} width={400} height={300} alt="Processed Image" />
        <h1 className="w-full mt-4 px-4 font-bold text-2xl text-right">
          {formattedDate}
        </h1>
      </div>
      <button
        onClick={handleRedirect}
        className="mt-10 px-6 py-2 w-[280px] font-bold bg-green-dark text-white rounded-lg"
      >
        編集する
      </button>
    </div>
  );
}
