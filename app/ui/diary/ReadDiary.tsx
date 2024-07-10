/* eslint-disable @next/next/no-img-element */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import { BookmarkIcon as OutlineBookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as SolidBookmarkIcon } from "@heroicons/react/24/solid";

import TagSection from "./TagSection";
import WeatherIcons from "./WeatherIcons";
import { getDiaryDate } from "@/util/date";
import { updateDiaryRemember } from "@/store/api";

export default function ReadDiary({ date, diaryData }: any) {
  const queryClient = useQueryClient();

  const { mutate: diaryRememberMutate } = useMutation({
    mutationKey: ["updateDiaryRemember"],
    mutationFn: updateDiaryRemember,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["getDiaryForDay"] });

      const prevDiary = queryClient.getQueryData(["getDiaryForDay"]);

      queryClient.setQueryData(["getDiaryForDay"], (old: any) => ({
        ...old,
        remember: !old.remember,
      }));

      return { prevDiary };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["getDiaryForDay"], context?.prevDiary);
    },
  });

  /* Remember 버튼 클릭 시 */
  const handleRemember = () => {
    diaryRememberMutate({
      diaryId: diaryData.id,
      remember: true,
    });
  };

  /* feelings 문자열을 배열로 변환 */
  const feelingsTags = diaryData ? JSON.parse(diaryData.feelings) : [];

  return (
    <article>
      <section className="flex w-full min-w-[360px] max-w-[600px] flex-col rounded ">
        {/* 이미지 있을 경우에만 (images &&)*/}
        {diaryData && diaryData.photos && diaryData.photos.length > 0 && (
          <div className="relative">
            <Swiper
              effect={"cards"}
              cardsEffect={{
                perSlideOffset: 3,
                perSlideRotate: 3,
                rotate: true,
                slideShadows: false,
              }}
              grabCursor={true}
              modules={[EffectCards]}
              scrollbar={{ draggable: true }}
              mousewheel={true}
              className="h-96 w-11/12"
            >
              {diaryData &&
                diaryData.photos.map((photo: any) => (
                  <SwiperSlide
                    key={photo.id}
                    className="flex items-center justify-center rounded-lg"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_BUCKET_URL}${photo.url}`}
                      alt={`Diary Image ${photo.id}`}
                      className="h-full w-full object-cover"
                    />
                  </SwiperSlide>
                ))}
            </Swiper>

            {/* 이미지 개수 -> text */}
            <div className="absolute -bottom-4 right-10 z-10 flex size-10 items-center justify-center rounded-xl bg-default-900 text-sm font-semibold">
              +{diaryData.photos.length}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 px-8 py-6">
          <div className="flex items-center gap-2">
            {/* 일기의 Remember */}
            <button onClick={handleRemember}>
              {diaryData.remember ? (
                <SolidBookmarkIcon className="size-6 stroke-2" />
              ) : (
                <OutlineBookmarkIcon className="size-6 stroke-2" />
              )}
            </button>

            {/* 일기의 날짜 */}
            <h1 className="text-md font-semibold">{getDiaryDate(date)}</h1>
          </div>
          <div className="flex flex-col gap-1 pb-10">
            {/* 일기의 제목 */}
            <h1 className="text-lg font-bold">{diaryData.title}</h1>
            {/* 일기의 내용 */}
            <p className="break-all text-base font-medium text-default-700">
              {diaryData.body}
            </p>
          </div>
          {/* 일기의 날씨정보 */}
          <div className="flex w-full items-center justify-end gap-2">
            <WeatherIcons
              weatherId={diaryData.weatherId}
              className="size-4 fill-current text-black"
            />
            <span className="text-sm font-medium">{diaryData.weather}</span>
          </div>
        </div>
      </section>
      {/* 태그 섹션 */}
      <TagSection feelingsTags={feelingsTags} />
    </article>
  );
}
