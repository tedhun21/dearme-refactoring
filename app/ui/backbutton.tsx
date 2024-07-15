"use client";

import { useRouter } from "next/navigation";
import BackIcon from "@/public/common/BackIcon";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      className="flex size-10 items-center justify-center rounded-full hover:bg-default-300 active:bg-default-400"
      type="button"
      onClick={() => router.back()}
    >
      <BackIcon />
    </button>
  );
}
