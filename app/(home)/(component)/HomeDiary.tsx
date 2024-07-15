"use client";

import Link from "next/link";

import { useRecoilState } from "recoil";
import dayjs from "dayjs";
import { BookmarkSquareIcon, PhotoIcon } from "@heroicons/react/24/outline";

import { IDiary, diaryListState, settingState } from "@/store/atoms";
import WeatherIcons from "@/app/[date]/diary/(component)/WeatherIcons";

export default function HomeDiary() {
  const [{ date, isLogin }, setSetting] = useRecoilState(settingState);
  const [diaries, setDiaries] = useRecoilState(diaryListState);
  const filteredDiaries = diaries.filter(
    (diary: IDiary) => diary.date === dayjs(date).format("YYYY-MM-DD"),
  );

  const diaryOfDay = (
    filteredDiaries.length > 0 ? filteredDiaries[0] : null
  ) as IDiary | null;

  return (
    <section className="mt-4">
      {isLogin ? (
        <Link href={`/${dayjs(date).format("YYYY-MM-DD")}/diary`}>
          <div className="group flex flex-col rounded-xl border-2 border-default-300 bg-default-100 p-3 text-xl shadow-xl transition-colors duration-150 hover:border-default-400 hover:bg-default-900">
            {diaryOfDay ? (
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <span className="text-3xl font-semibold text-default-900 group-hover:text-default-100">
                    Diary
                  </span>
                  <div className="flex gap-1">
                    {diaryOfDay.remember && (
                      <BookmarkSquareIcon className="size-6 stroke-2 text-default-600 group-hover:text-white" />
                    )}
                    {diaryOfDay.photos?.length > 0 && (
                      <PhotoIcon className="size-6 stroke-2 text-default-600 group-hover:text-white" />
                    )}
                  </div>
                </div>
                <div className="flex w-full flex-col justify-center p-5">
                  <div className="flex items-center justify-between gap-5 font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 text-2xl">
                        <span>{dayjs(date).format("MMMM")}</span>
                        <span>{dayjs(date).format("D")},</span>
                        <span>{dayjs(date).format("YYYY")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <span className="flex justify-center">
                      {diaryOfDay.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-sm">
                    <WeatherIcons
                      weatherId={diaryOfDay.weatherId}
                      className="size-5 fill-current text-black"
                    />
                    <span>{diaryOfDay.weather}</span>
                  </div>
                </div>
              </div>
            ) : (
              !diaryOfDay && (
                <div className="group flex flex-col">
                  <div>
                    <span className="text-3xl font-semibold text-default-900 group-hover:text-default-100">
                      Diary
                    </span>
                    <div className="flex flex-col items-center justify-center p-2 *:text-xl">
                      <span>No Written Diary</span>
                      <span>Click to write Diary</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </Link>
      ) : !isLogin ? (
        <Link href="/login">
          <div className="group flex flex-col items-center rounded-xl border-2 border-default-300 bg-default-100 p-5 text-xl text-default-800 shadow-xl transition-colors duration-150 hover:border-default-400 hover:bg-default-900">
            <span className="text-2xl font-semibold group-hover:text-default-100">
              Would you like to write yourself?
            </span>
            <span className="text-xl group-hover:text-default-100">
              Let&#39;s login first
            </span>
          </div>
        </Link>
      ) : null}
    </section>
  );
}
