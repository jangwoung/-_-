"use client";

import { useState } from "react";
import { Modal } from "../components/modal";

export default function ModalTest() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="bg-white min-h-svh">
      dsfa
      <button
        className="h-20 w-[320px] bg-green-dark"
        onClick={() => setIsOpened(true)}
      />
      <Modal isOpened={isOpened} setIsOpened={setIsOpened}>
        <ModalContent />
      </Modal>
    </div>
  );
}

const ModalContent = () => {
  return <div>helooo</div>;
};
