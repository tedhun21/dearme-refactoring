/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Header from "@/app/ui/header";
import ReadDiary from "@/app/ui/diary/ReadDiary";

import SentimentalQuotes from "@/app/ui/diary/Sentimental Quotes";
import MonthlyDiary from "@/app/ui/diary/MonthlyDiary";
import DiaryActionButton from "@/app/ui/diary/DiaryActionButton";

import Footer from "@/app/ui/footer";

import { getDiaryForDay, getMe } from "@/store/api";
import TodayPicks from "@/app/ui/diary/TodayPicks";
import CirclePlus from "@/public/diary/CirclePlus";
import { useRouter } from "next/navigation";

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

  const handleClick = () => {
    if (date) {
      router.push(`/${date}/diary/create`);
    }
  };

  return (
    <main className="relative flex min-h-screen justify-center">
      <div className="flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 shadow-lg">
        <Header />
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
            <Footer me={meData} />
          </div>
        ) : (
          // 일기 데이터가 없을 경우 렌더링
          <>
            <article className="absolute flex flex-col">
              <SentimentalQuotes />
              <section className="relative top-[-120px]">
                <div className="p-4">
                  <button
                    onClick={() => handleClick()}
                    className="flex h-full w-full flex-col items-center gap-2 rounded bg-default-100 p-24 shadow-xl hover:bg-gray-300"
                  >
                    <CirclePlus className="h-6 w-6 fill-current text-black" />
                    <span>Write your precious a Diary</span>
                  </button>
                </div>
              </section>
              <section className="relative right-20 flex justify-end">
                <MonthlyDiary />
              </section>
            </article>
            <Footer me={meData} />
          </>
        )}
      </div>
    </main>
  );
}
