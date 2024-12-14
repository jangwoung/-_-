import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faTicket,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface MenuProps {
  menuOpened: boolean;
  setMenuOpened: (menuOpened: boolean) => void;
}

export const Menu: React.FC<MenuProps> = ({ menuOpened, setMenuOpened }) => {
  return (
    <>
      <div className="w-12 z-30" onClick={() => setMenuOpened(!menuOpened)}>
        <ul>
          <li
            className={`w-10 h-2 mb-2 bg-green-dark rounded-full duration-150  ${
              menuOpened
                ? "rotate-45 translate-y-[8px] bg-beige"
                : "bg-green-dark "
            }`}
          ></li>
          <li
            className={`w-10 h-2 bg-green-dark rounded-full duration-150 ${
              menuOpened
                ? "rotate-[-45deg] translate-y-[-8px] bg-beige"
                : "bg-green-dark "
            }`}
          ></li>
        </ul>
      </div>

      <div
        className={`fixed top-0 bg-black w-[420px] min-h-svh duration-300 ${
          !menuOpened ? "opacity-0" : "opacity-40"
        }`}
      ></div>

      <div
        className={`fixed top-1/3 bg-green-dark mx-[10px] w-[400px] py-12  rounded-xl duration-200 delay-100 ${
          !menuOpened && "opacity-0"
        }`}
      >
        <div className="flex justify-around items-center text-beige text-center text-3lx font-bold">
          <Link href="/camera">
            <FontAwesomeIcon icon={faCamera} className="w-12 h-12" />
            <h1>撮影</h1>
          </Link>
          <Link href="/ticket">
            <FontAwesomeIcon icon={faTicket} className="w-12 h-12" />
            <h1>チケット</h1>
          </Link>
          <Link href="/view">
            <FontAwesomeIcon icon={faSearch} className="w-12 h-12" />
            <h1>探す</h1>
          </Link>
        </div>
      </div>
    </>
  );
};
