"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

import Header from "@/app/ui/header/Header";
import Footer from "@/app/ui/footer/Footer";
import { getDiaryForDay, getMe } from "@/store/api";
import ReadDiary from "@/app/ui/diary/ReadDiary";
import ReadTodayPick from "@/app/ui/diary/ReadTodayPick";
import MonthlyDiaryLink from "@/app/ui/diary/MonthlyDiaryLink";
import DiaryActionButton from "@/app/ui/diary/DiaryActionButton";
import SentimentalQuotes from "@/app/ui/diary/Sentimental Quotes";

export default function Diary() {
  const { date } = useParams();

  // 내 정보 가져오기
  const { data: meData } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => getMe(),
  });

  const { isSuccess: isSuccessDiary, data: diaryData } = useQuery({
    queryKey: ["getDiaryForDay"],
    queryFn: () => getDiaryForDay({ date }),
  });

  return (
    <main className="flex min-h-screen justify-center">
      <div className="relative flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 shadow-lg">
        <Header me={meData} />
        {/* // 일기가 있을때 */}
        {diaryData ? (
          <div className="flex h-full flex-col gap-8">
            {/* 일기 데이터가 있을 경우 렌더링 */}
            <ReadDiary date={date} diaryData={diaryData} />
            {diaryData.today_picks?.length > 0 && (
              <ReadTodayPick picks={diaryData.today_picks} />
            )}
            <section className="mb-52 p-5">
              <div className="flex justify-end gap-2">
                <DiaryActionButton
                  date={date}
                  diaryId={diaryData.id as string}
                  actionType="Edit"
                />
                <DiaryActionButton
                  date={date}
                  diaryId={diaryData.id as string}
                  actionType="Delete"
                />
              </div>
            </section>
          </div>
        ) : isSuccessDiary ? (
          // 일기가 없을 때
          <article className="absolute flex w-full flex-col">
            <SentimentalQuotes />
            <div className="absolute inset-x-0 top-[380px] xxs:top-[460px] xs:top-[550px] s:top-[680px]">
              <section className="w-full">
                <Link
                  href={`/${date}/diary/create`}
                  className="mx-10 flex flex-col items-center gap-2 rounded bg-default-100 p-12 shadow-xl hover:bg-default-800 *:hover:text-white active:bg-default-900"
                >
                  <PlusCircleIcon className="size-8" />
                  <span className="text-center">
                    Write your precious a Diary
                  </span>
                </Link>
              </section>
            </div>
          </article>
        ) : null}
        <MonthlyDiaryLink date={date} />
        <Footer />
      </div>
    </main>
  );
}
