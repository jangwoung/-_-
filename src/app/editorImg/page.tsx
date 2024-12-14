"use client";
import React, { useState, useEffect , useRef } from "react";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Konva from 'konva';
//コンポーネント
import Sidebar from "../components/Editor/Sidebar";
import ImageEditor from "../components/Editor/ImageEditor";
// ボタン関係
import IconButtons from "../components/Editor/IconButtons";
import TextControls from "../components/Editor/Function/TextControls";
import ShapeControls from "../components/Editor/Function/ShapeControls";
// モジュールスタイル
import styles from "../components/Editor/styles/canvas.module.css";
import {exportToImage} from"../components/utils/exportImage";
import { redirectToVoucher } from "../components/utils/redirectToVoucher";

export default function SinthesisImage() {
  const [showColorReducer, setShowColorReducer] = useState(false);
  const [showTextControl, setShowTextControl] = useState(false);
  const [showShapeControl, setShowShapeControl] = useState(false);
  const [objects, setObjects] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  if (!imageUrl) return <p>画像が見つかりません。</p>;

  const stageRef = useRef<Konva.Stage>(null);

  const handleRedirect = () => {
    exportToImage(stageRef); // 画像のデータURLを取得
    redirect("/voucher");
  };
  
  return (
    <div className="text-center justify-center">
      <div className="mt-[20vh] text-lg text-white font-bold">
        <p>編集ページ</p>
      </div>
      <div className="flex items-center justify-center ">
        <IconButtons
          setShowColorReducer={setShowColorReducer}
          setShowTextControl={setShowTextControl}
          setShowShapeControl={setShowShapeControl}
        />
       
      </div>
      <div className={styles.CunvasBack}>
        {/* サイドバー */}
        <ImageEditor 
          stageRef={stageRef}
          imageUrl={imageUrl} 
          objects={objects}
          setObjects={setObjects} 
        />
        <Sidebar objects={objects} setObjects={setObjects} />
      </div>
      {/*関数呼び出す*/}
      {showTextControl && <TextControls setObjects={setObjects} />}
      {showShapeControl && <ShapeControls setObjects={setObjects} />}
      <button
        onClick={handleRedirect}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
      >
        完成
      </button>
      

    </div>
  );
}
