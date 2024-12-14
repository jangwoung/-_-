import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

interface ModalProps {
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpened,
  setIsOpened,
  children,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        id="modalContent"
        className={`fixed p-0 z-30 flex h-[55vh] w-screen sm:w-[420px] sm:w-lg xl:w-xl scroll-mt-0 flex-col items-center hidden-scrollbar rounded-t-2xl bg-white pb-12 duration-200 delay-75 shadow-[0_-8px_12px_4px_rgba(0,0,0,0.3)]
        ${isOpened ? "bottom-0 opacity-100" : "bottom-[-100vh] opacity-0"}`}
      >
        <div
          className="absolute bottom-4 w-12 h-12 bg-green-light rounded-full flex justify-center items-center text-white font-bold text-lg"
          onClick={() => {
            setIsOpened(false);
          }}
        >
          <FontAwesomeIcon icon={faX} className="w-6 h-6" />
        </div>
        {children}
      </div>
    </div>
  );
};
