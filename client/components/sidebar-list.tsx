import authContext from "@/contexts/authContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { IconType } from "react-icons";
import {
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

interface Item {
  title: string;
  href: string;
  activeIcon: IconType;
  inactiveIcon: IconType;
}

const SidebarList = () => {
  const auth = useContext(authContext);

  const pathname = usePathname();

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
      href: `/${auth.username}`,
      activeIcon: HiUserCircle,
      inactiveIcon: HiOutlineUserCircle,
    },
  ];
  return (
    <ul className="mt-8 flex flex-col gap-2">
      {items.map((item, i) => (
        <Link href={item.href} key={i}>
          <li className="flex items-center gap-4 hover:bg-gray-100 px-2 py-3 rounded-lg">
            {item.href == pathname ? (
              <item.activeIcon className="text-3xl" />
            ) : (
              <item.inactiveIcon className="text-3xl" />
            )}
            <span
              className={`text-md ${item.href == pathname ? "font-bold" : ""}`}
            >
              {item.title}
            </span>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default SidebarList;
