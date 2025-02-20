
import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import logo from "@/public/logo.png";
import Menu from "./menu";

const Header = () => {
    return <header className="w-full border-b">
        <div className="wrapper flex-between">
            <div className="flex-start">
                <Link href="/" className="flex-start">
                <span className="w-16 h-16"><Image src={logo} alt="" color="white" priority/></span>
                <span className="hidden lg:block font-bold text-2xl ml-3">{APP_NAME}</span>
            </Link>
            </div>
            <Menu/>
        </div>
    </header>;
}
 
export default Header;