import Image from "next/image";
import Link from "next/link";

import { HashtagIcon, XMarkIcon } from "@heroicons/react/24/outline";

import UserWithNoImage from "@/public/social/UserWithNoImage";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;
export default function RecentSearch({ recent, onRecentRemove }: any) {
  return (
    <div className="flex items-center justify-between rounded-lg p-2 hover:bg-default-200 active:hover:bg-default-300">
      <Link
        href={
          recent?.text.startsWith("#")
            ? `/search/${recent?.text.substring(1)}`
            : `/profile/${recent?.userId}`
        }
        className="flex flex-grow items-center gap-3"
      >
        {recent?.text.startsWith("#") ? (
          <div className="flex size-12 items-center justify-center rounded-full bg-white">
            <HashtagIcon className="size-6 stroke-2 text-default-500" />
          </div>
        ) : recent?.photo ? (
          <div className="relative size-12 overflow-hidden rounded-full">
            <Image
              src={`${BUCKET_URL}${recent?.photo}`}
              alt="User Image"
              className="object-cover"
              fill
            />
          </div>
        ) : (
          <UserWithNoImage className="size-12" />
        )}

        <span className="text-base font-semibold text-default-700">
          {recent?.text}
        </span>
      </Link>
      <button onClick={() => onRecentRemove(recent?.id)}>
        <XMarkIcon className="size-5 text-default-700" />
      </button>
    </div>
  );
}
