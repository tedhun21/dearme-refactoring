import { useState } from "react";
import Image from "next/image";

import RememberModal from "./RememberModal";
import dayjs from "dayjs";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function DiaryCard({ remember }: any) {
  // modal

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <div className="group relative flex flex-shrink-0">
      <div
        className="relative h-[300px] w-[240px] cursor-pointer overflow-hidden rounded-2xl"
        onClick={() => handleOpen()}
      >
        {remember.photos ? (
          <Image
            alt="diary first image"
            src={`${BUCKET_URL}${remember.photos[0].url}`}
            className="object-cover group-hover:opacity-50"
            fill
          />
        ) : (
          <div className="h-full w-full rounded-2xl bg-default-800 group-hover:opacity-95" />
        )}

        {/* 호버링 컨테이너 */}
        <div className="absolute inset-0 z-10 hidden flex-col justify-between p-2 text-white group-hover:flex">
          {/* date */}
          <div className="flex flex-col">
            <span className="text-2xl font-semibold">
              {dayjs(remember.date).format("DD")}
            </span>
            <span className="font-base text-xl">
              {dayjs(remember.date).format("MMM")}
            </span>
          </div>
          {/* 일기 타이틀 */}
          <div className="text-center">
            <span className="font-semibold">{'"' + remember.title + '"'}</span>
          </div>
          {/* 연도 & more */}
          <div className="flex w-full items-center justify-between">
            <div className="flex-grow">
              <span>{dayjs(remember.date).format("YYYY")}</span>
              <div className="h-[1px] bg-white" />
            </div>
            <div className="flex-0">
              <button
                type="button"
                onClick={handleOpen}
                className="size-7 rounded-full p-1 hover:bg-default-500"
              >
                <EllipsisVerticalIcon className="stroke-2 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <RememberModal
        remember={remember}
        open={open}
        handleClose={handleClose}
      />
    </div>
  );
}
