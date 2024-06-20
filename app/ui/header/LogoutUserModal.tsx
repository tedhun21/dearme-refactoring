import { useEffect, useRef, useState } from "react";

import { UserIcon } from "@heroicons/react/24/outline";
import ModalList from "./ModalList";

const modalList = [
  { id: 1, label: "Log In", href: "/login" },
  { id: 2, label: "Sign Up", href: "/signup" },
  { id: 3, label: "Setting" },
];

export default function LogoutUserModal() {
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

    return () => {
      document.removeEventListener("click", closeModal);
    };
  }, [openModal]);
  return (
    <button
      onClick={handleModalOpen}
      className="relative rounded-full p-2 hover:bg-default-300"
    >
      <UserIcon className="size-6 stroke-2" />
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
