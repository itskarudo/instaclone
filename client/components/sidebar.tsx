"use client";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import {
  HiBars3,
  HiChatBubbleOvalLeftEllipsis,
  HiHeart,
  HiHome,
  HiMagnifyingGlass,
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
  HiUserCircle,
} from "react-icons/hi2";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

interface Item {
  title: string;
  href: string;
  activeIcon: IconType;
  inactiveIcon: IconType;
}

const items: Item[] = [
  {
    title: "Home",
    href: "/home",
    activeIcon: HiHome,
    inactiveIcon: HiOutlineHome,
  },
  {
    title: "Search",
    href: "/search",
    activeIcon: HiMagnifyingGlass,
    inactiveIcon: HiOutlineMagnifyingGlass,
  },
  {
    title: "Messages",
    href: "/messages",
    activeIcon: HiChatBubbleOvalLeftEllipsis,
    inactiveIcon: HiOutlineChatBubbleOvalLeftEllipsis,
  },
  {
    title: "Notifications",
    href: "/notifications",
    activeIcon: HiHeart,
    inactiveIcon: HiOutlineHeart,
  },
  {
    title: "Profile",
    href: "/profile",
    activeIcon: HiUserCircle,
    inactiveIcon: HiOutlineUserCircle,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="p-4 w-1/6 border-gray-300 border-r-[1px] border-solid h-screen flex flex-col justify-between fixed">
      <div>
        <Link href="/home">
          <h1 className={`my-5 ml-3 text-2xl ${pacifico.className}`}>
            Instaclone
          </h1>
        </Link>
        <ul className="mt-8 flex flex-col gap-2">
          {items.map((item, i) => (
            <Link href={item.href} key={i}>
              <li className="flex items-center gap-4 hover:bg-gray-100 px-2 py-3 rounded-lg">
                {item.href == pathname ? (
                  <item.activeIcon className="text-3xl" />
                ) : (
                  <item.inactiveIcon className="text-3xl" />
                )}
                <span className="font-bold text-md">{item.title}</span>
              </li>
            </Link>
          ))}
        </ul>
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
