"use client";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { HiBars3 } from "react-icons/hi2";
import SidebarList from "./sidebar-list";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

const Sidebar = () => {
  return (
    <div className="p-4 w-1/6 border-gray-300 border-r-[1px] border-solid h-screen flex flex-col justify-between fixed">
      <div>
        <Link href="/home">
          <h1 className={`my-5 ml-3 text-2xl ${pacifico.className}`}>
            Instaclone
          </h1>
        </Link>
        <SidebarList />
      </div>
      <div>
        <li className="flex items-center gap-4 hover:bg-gray-100 px-2 py-3 rounded-lg cursor-pointer">
          <HiBars3 className="text-3xl" />
          <span className="text-md">More</span>
        </li>
      </div>
    </div>
  );
};

export default Sidebar;
