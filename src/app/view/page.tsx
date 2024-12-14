"use client";

import { useState } from "react";
import { HeadLogo } from "./components/head-logo";
import { Menu } from "./components/menu";
import { Cards } from "./components/view-cards";
import { Search } from "./components/search";

export default function View() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);

  return (
    <div className="bg-green-light shadow-lg min-h-svh">
      <div className="flex justify-between items-center">
        <HeadLogo />
        <Menu menuOpened={menuOpened} setMenuOpened={setMenuOpened} />
      </div>

      <Cards />
      <Search searchOpened={searchOpened} setSearchOpened={setSearchOpened} />
    </div>
  );
}
