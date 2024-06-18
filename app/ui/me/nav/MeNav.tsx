"use client";

import { usePathname } from "next/navigation";

import {
  BookmarkSquareIcon,
  ClipboardDocumentCheckIcon,
  RectangleStackIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import MeNavList from "./MeNavList";

const navList = [
  { id: 1, label: "Plans", href: "/me", icon: ClipboardDocumentCheckIcon },
  { id: 2, label: "Posts", href: "/me/posts", icon: RectangleStackIcon },
  { id: 3, label: "Followers", href: "/me/followers", icon: UsersIcon },
  {
    id: 4,
    label: "Remember",
    href: "/diary/remember",
    icon: BookmarkSquareIcon,
  },
];

export default function MeNav() {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/me/friends" && pathname !== "/me/edit" && (
        <section className="flex justify-between bg-default-300">
          {navList.map((nav) => (
            <MeNavList
              key={nav.id}
              href={nav.href}
              label={nav.label}
              icon={nav.icon}
              pathname={pathname}
            />
          ))}
        </section>
      )}
    </>
  );
}
