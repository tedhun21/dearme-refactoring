import Image from "next/image";

import UserWithNoImage from "@/public/social/UserWithNoImage";
import { useEffect, useRef, useState } from "react";
import ModalList from "./ModalList";

const BUCKET_URL = process.env.NEXT_BUCKET_URL;

const modalList = [
  { id: 1, label: "My Page", href: "/me" },
  { id: 2, label: "Setting" },
  { id: 3, label: "Log Out" },
];

export default function LoginUserModal({ me }: any) {
  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleModalOpen = () => {
    setOpenModal((prev) => !prev);
  };

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (
        openModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      ) {
        setOpenModal(false);
      }
    };
    document.addEventListener("click", closeModal);
    return () => document.removeEventListener("click", closeModal);
  }, [openModal]);

  return (
    <button onClick={handleModalOpen} className="relative size-10">
      {me?.photo?.url ? (
        <Image
          src={`${BUCKET_URL}${me.photo.url}`}
          alt="user photo"
          fill
          className="object-cover"
        />
      ) : (
        <UserWithNoImage className="h-full w-full" />
      )}
      {openModal ? (
        <div
          ref={modalRef}
          className="absolute right-0 flex w-28 flex-col gap-1 rounded-lg border-2 bg-white px-1 py-2"
        >
          {modalList.map((list) => (
            <ModalList key={list.id} label={list.label} href={list.href} />
          ))}
        </div>
      ) : null}
    </button>
  );
}
