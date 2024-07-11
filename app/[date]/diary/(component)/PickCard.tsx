import Image from "next/image";

import { useMutation } from "@tanstack/react-query";

import { deleteTodayPick } from "@/api/today-pick/api";
import DearmeLogo from "@/public/login/DearmeLogo";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;
export default function PickCard({
  type,
  imageType,
  pick,
  setPicks,
  setSelectedPicks,
}: any) {
  const { mutate: deleteTodayPickMutate } = useMutation({
    mutationKey: ["deleteTodayPick"],
    mutationFn: deleteTodayPick,
    onSuccess: ({ data }) => {
      setPicks((prev: any) => prev.filter((pick: any) => pick.id !== data.id));
    },
  });

  const handleRemovePick = (index: number) => {
    if (imageType === "url") {
      deleteTodayPickMutate(index);
    } else if (imageType === "blob") {
      setSelectedPicks((prev: any) =>
        prev.filter((pick: any) => pick.id !== index),
      );
    }
  };
  return (
    <div className="relative text-white">
      {imageType && pick.image ? (
        <div className="relative h-[180px] w-[140px]">
          <Image
            alt={`pick image ${pick.id}`}
            src={
              imageType === "url"
                ? `${BUCKET_URL}${pick.image.url}`
                : URL.createObjectURL(pick.image)
            }
            className="object-cover"
            fill
            priority
          />
        </div>
      ) : (
        <div className="flex h-[180px] w-[140px] items-center justify-center">
          <DearmeLogo />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold">{pick.title}</span>
        <span className="text-xs">{pick.contributors}</span>
        <span className="text-2xs">{pick.date}</span>
      </div>

      {type === "create" && (
        <button
          type="button"
          onClick={() => handleRemovePick(pick.id)}
          className="absolute right-[-8px] top-[-8px] flex size-5 items-center justify-center rounded-full bg-red-500 pb-[1.8px]"
        >
          <span>&times;</span>
        </button>
      )}
    </div>
  );
}
