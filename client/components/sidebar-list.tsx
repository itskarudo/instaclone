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
  HiOutlinePlusCircle,
  HiOutlineUserCircle,
  HiPlusCircle,
  HiUserCircle,
} from "react-icons/hi2";
import { createPageModal } from "./create/create-modal";

interface Item {
  title: string;
  href?: string;
  activeIcon: IconType;
  inactiveIcon: IconType;
}

const ButtonContent: React.FC<{ item: Item }> = ({ item }) => {
  const pathname = usePathname();
  return (
    <li className="flex items-center gap-4 hover:bg-gray-100 px-2 py-3 rounded-lg">
      {item.href === pathname ? (
        <item.activeIcon className="text-3xl" />
      ) : (
        <item.inactiveIcon className="text-3xl" />
      )}
      <span className={`text-md ${item.href == pathname ? "font-bold" : ""}`}>
        {item.title}
      </span>
    </li>
  );
};

const SidebarList = () => {
  const auth = useContext(authContext);
  const modal = useContext(createPageModal.modalContext);

  const items = {
    home: {
      title: "Home",
      href: "/home",
      activeIcon: HiHome,
      inactiveIcon: HiOutlineHome,
    },
    search: {
      title: "Search",
      href: "/search",
      activeIcon: HiMagnifyingGlass,
      inactiveIcon: HiOutlineMagnifyingGlass,
    },
    messages: {
      title: "Messages",
      href: "/messages",
      activeIcon: HiChatBubbleOvalLeftEllipsis,
      inactiveIcon: HiOutlineChatBubbleOvalLeftEllipsis,
    },
    notifications: {
      title: "Notifications",
      href: "/notifications",
      activeIcon: HiHeart,
      inactiveIcon: HiOutlineHeart,
    },
    create: {
      title: "Create",
      activeIcon: HiPlusCircle,
      inactiveIcon: HiOutlinePlusCircle,
    },
    profile: {
      title: "Profile",
      href: `/${auth.username}`,
      activeIcon: HiUserCircle,
      inactiveIcon: HiOutlineUserCircle,
    },
  };

  return (
    <ul className="mt-8 flex flex-col gap-2">
      <Link href={items.home.href}>
        <ButtonContent item={items.home} />
      </Link>
      <Link href={items.search.href}>
        <ButtonContent item={items.search} />
      </Link>
      <Link href={items.messages.href}>
        <ButtonContent item={items.messages} />
      </Link>
      <Link href={items.notifications.href}>
        <ButtonContent item={items.notifications} />
      </Link>
      <button onClick={() => modal.setIsOpen(true)}>
        <ButtonContent item={items.create} />
      </button>
      <Link href={items.profile.href}>
        <ButtonContent item={items.profile} />
      </Link>
    </ul>
  );
};

export default SidebarList;
