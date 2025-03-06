import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import logo from "@/public/logo.png";
import Menu from "./menu";
import CategoryDraw from "./catetory-draw";
import Search from "./search";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDraw />
          <Link href="/" className="flex-start ml-4">
            <span className="w-16 h-16">
              <Image src={logo} alt="" color="white" priority />
            </span>
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
