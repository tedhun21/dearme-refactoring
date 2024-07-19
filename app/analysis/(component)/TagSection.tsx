import { ChangeEvent, useEffect, useState } from "react";

import { useRecoilState } from "recoil";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { ISetting, settingState, Tag } from "@/store/atoms";
import { useQuery } from "@tanstack/react-query";
import { getTagCountsByDiary } from "@/api/post/api";
import dayjs from "dayjs";

export default function TagSection({ date, isMonth }: any) {
  const [{ tag }, setSetting] = useRecoilState<ISetting>(settingState);
  const formattedDate = isMonth
    ? dayjs(date).format("YYYY-MM")
    : dayjs(date).format("YYYY");
  const [tagPage, setTagPage] = useState(1);
  const itemsPerPage = 5;

  // TODO: Pagination
  const { data: tagData } = useQuery({
    queryKey: ["getTagCountsByDiary", formattedDate, tag],
    queryFn: () => getTagCountsByDiary({ date: formattedDate, tag }),
    enabled: !!formattedDate && !!tag,
  });

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSetting((prev: ISetting) => ({ ...prev, tag: e.target.value as Tag }));
  };

  const onClickNextPage = () => {
    if (tagPage < Math.ceil(tagData.length / 5)) {
      setTagPage((prev) => prev + 1);
    }
  };

  const onClickPreviousPage = () => {
    if (tagPage > 1) {
      setTagPage((prev) => prev - 1);
    }
  };

  const displayedTags = tagData?.slice(
    (tagPage - 1) * itemsPerPage,
    tagPage * itemsPerPage,
  );

  return (
    <section>
      <h1 className="text-xl font-semibold">Tag Rank</h1>
      <div className="flex items-center justify-between">
        <span className="text-default-700">
          You can see the tags and their respective record counts
        </span>
        <select
          value={tag}
          onChange={handleSelect}
          className="bg-transparent outline-none"
        >
          <option value={Tag.ALL}>ALL</option>
          <option value={Tag.WITH}>WITH</option>
          <option value={Tag.MOOD}>MOOD</option>
        </select>
      </div>
      <div className="rounded-2xl bg-default-100 p-5">
        <div className="mb-4 flex justify-between border-b-2 border-default-400">
          <span>RANK</span>
          <span>COUNT</span>
        </div>
        <div className="flex flex-col gap-2">
          {displayedTags?.map((tag: any) => (
            <div key={tag.rank} className="flex justify-between">
              <div className="flex size-8 items-center justify-center bg-gray-300">
                <span className="font-bold">{tag.rank}</span>
              </div>
              <span>{tag.tag}</span>
              <div className="flex">
                <span>{tag.count}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-3 border-t-2 border-default-400 pt-3">
          <button
            onClick={onClickPreviousPage}
            className="rounded-full bg-default-300 p-1 hover:bg-default-400"
          >
            <ChevronLeftIcon className="size-5 stroke-2" />
          </button>
          <button
            onClick={onClickNextPage}
            className="rounded-full bg-default-300 p-1 hover:bg-default-400"
          >
            <ChevronRightIcon className="size-5 stroke-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
