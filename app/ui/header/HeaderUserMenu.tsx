"use client";

import { MouseEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Menu } from "@mui/material";
import { UserIcon } from "@heroicons/react/24/outline";

import UserWithNoImage from "@/public/social/UserWithNoImage";
import ModalList from "./ModalList";
import { deleteCookie } from "@/util/tokenCookie";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function HeaderUserMenu({ me }: any) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleClose();
    await deleteCookie("access_token");
    window.location.reload();
  };

  const modalList = me
    ? [
        { id: 1, label: "My Page", href: "/me" },
        { id: 2, label: "Setting" },
        { id: 3, label: "Log Out", onClick: handleSignOut },
      ]
    : [
        { id: 1, label: "Log In", href: "/login" },
        { id: 2, label: "Sign Up", href: "/signup" },
        { id: 3, label: "Setting" },
      ];

  return (
    <>
      <button
        type="button"
        onClick={handleMenuOpen}
        className="relative flex size-10 items-center justify-center overflow-hidden rounded-full ring-offset-1 hover:ring-2 hover:ring-default-900"
      >
        {me && me.photo?.url ? (
          <Image
            src={`${BUCKET_URL}${me.photo.url}`}
            alt="user photo"
            fill
            className="object-cover"
          />
        ) : me && !me.photo ? (
          <UserWithNoImage className="size-6" />
        ) : (
          <UserIcon className="size-6 stroke-2" />
        )}
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            width: "100px",
            borderRadius: "8px",
          },
        }}
      >
        <div className="flex flex-col gap-1 px-2">
          {modalList.map((list) => (
            <ModalList
              key={list.id}
              label={list.label}
              href={list.href}
              onClick={list.onClick}
            />
          ))}
        </div>
      </Menu>
    </>
  );
}
