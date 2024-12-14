"use client";

import { useState } from "react";
import { HeadLogo } from "./components/head-logo";
import { Menu } from "./components/menu";

export default function View() {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <div className="bg-white shadow-lg min-h-svh">
      <div className="flex justify-between items-center">
        <HeadLogo />
        <Menu menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      </div>
    </div>
  );
}
