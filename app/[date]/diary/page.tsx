"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { PlusCircleIcon, TicketIcon } from "@heroicons/react/24/outline";

import { getDiaryForDay, getMe } from "@/store/api";
import Header from "@/app/ui/header/Header";
import ReadDiary from "@/app/ui/diary/ReadDiary";
import SentimentalQuotes from "@/app/ui/diary/Sentimental Quotes";
import MonthlyDiary from "@/app/ui/diary/MonthlyDiary";
import DiaryActionButton from "@/app/ui/diary/DiaryActionButton";
import Footer from "@/app/ui/footer/Footer";
import TodayPicks from "@/app/ui/diary/TodayPicks";

export default function Diary() {
  const { date } = useParams();
  const router = useRouter();

  // 내 정보 가져오기
  const { isSuccess, data: meData } = useQuery({
    queryKey: ["getMe"],
    queryFn: () => getMe(),
  });

  const { data: diaryData } = useQuery({
    queryKey: ["getDiaryForDay"],
    queryFn: () => getDiaryForDay({ date }),
  });

  return (
    <main className="flex min-h-screen justify-center">
      <div className="relative flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 shadow-lg">
        <Header me={meData} />
        {/* // 일기가 있을때 */}
        {diaryData ? (
          <div className="flex h-full flex-col">
            {/* 일기 데이터가 있을 경우 렌더링 */}
            <div>
              <ReadDiary date={date} diaryData={diaryData} />
              {diaryData?.today_picks?.length > 0 ? (
                <TodayPicks picks={diaryData?.today_picks} />
              ) : null}
            </div>
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
            <section className="relative right-20 flex justify-end">
              <MonthlyDiary />
            </section>
          </div>
        ) : (
          // 일기가 없을 때
          <article className="absolute flex w-full flex-col">
            <SentimentalQuotes date={date} />
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
            <div className="fixed bottom-36 w-full max-w-[600px]">
              <div className="absolute right-4 rounded-full bg-default-300 p-3 shadow-lg hover:bg-default-400 active:bg-default-900">
                <Link href={`/diary/${date}`}>
                  <TicketIcon className="size-10" />
                </Link>
              </div>
            </div>
          </article>
        )}

        <Footer />
      </div>
    </main>
  );
}
