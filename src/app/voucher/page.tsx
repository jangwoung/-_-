"use client";

import { useState } from "react";
import { Modal } from "../components/modal";

export default function Voucher() {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div className="text-center flex flex-col items-center bg-white min-h-svh">
      <Modal isOpened={isOpened} setIsOpened={setIsOpened}>
        <div>
          <h1 className="mt-8 mb-2 font-bold text-2xl">「XXXXXXX」</h1>
          <h2 className="mb-8 font-bold text-3xl">￥XXX引き</h2>
          <div className="w-[320px] h-[320px] rounded-md shadow-lg"></div>
        </div>
      </Modal>

      <div className="mt-16 text-xl text-base-black font-bold ">
        <p>私は</p>
        <h1 className="flex justify-center items-end text-6xl mt-1 mb-4">
          「XXXXXXXX」
        </h1>
        <p>の観光大臣！</p>
      </div>

      {/* 写真表示 */}
      <div className="mt-8 w-[400px] h-[300px] shadow-lg bg-gray-400"></div>
      <article className="mt-8 w-[400px]">
        <h1 className="text-3xl font-bold">XXXXXX</h1>
        <p className="text-wrap mt-2">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
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
