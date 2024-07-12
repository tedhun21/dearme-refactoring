import { useState } from "react";
import Image from "next/image";

import dayjs from "dayjs";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";

import { PhotoIcon } from "@heroicons/react/24/solid";

import WeatherIcons from "@/app/[date]/diary/(component)/WeatherIcons";
import Film from "@/public/remember/Film";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function RememberModal({ remember, open, handleClose }: any) {
  // tags
  const [showAllTags, setShowAllTags] = useState(false);

  const handleShowMoreTags = () => {
    setShowAllTags(true);
  };

  // photos
  const [showPhotos, setShowPhotos] = useState<boolean>(false);

  const handleTogglephotos = () => {
    setShowPhotos((prev) => !prev);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <Box className="relative left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-1/2 rounded-[16px] bg-black xxs:w-[390px] xs:w-[460px] s:w-[550px] ">
        {/* 필름 디자인 */}
        <div className="flex justify-between px-2 text-[10px] text-default-700 ">
          <div className="">DEARME 5017 EPR</div>
          <div className="">8</div>
          <div className="">DEARME 5017 EPR</div>
          <div className="">10</div>
        </div>
        <div className="flex w-full gap-5 px-1">
          {Array.from({ length: 20 }, (_, index) => (
            <div key={index} className="h-3 w-2 rounded-[2px] bg-default-500" />
          ))}
        </div>
        <div className="my-2 h-[1px] bg-default-900" />

        {/* Diary */}
        {remember && (
          <article className="flex w-full flex-col gap-2 px-4">
            <section className="flex items-center justify-between text-sm font-medium text-default-900">
              <div className="flex gap-1">
                <span>{dayjs(remember.date).format("DD")}</span>
                <span>{dayjs(remember.date).format("MMM")}</span>
                <span>{dayjs(remember.date).format("YYYY")}</span>
              </div>
              {remember.photos?.length > 0 && (
                <div>
                  <button
                    className="flex items-center gap-1 text-default-500 hover:text-default-900"
                    onClick={handleTogglephotos}
                  >
                    <PhotoIcon className="size-5" />
                    <span className="text-sm">Photos</span>
                  </button>
                </div>
              )}
            </section>
            {/* 일기 이미지 */}

            {remember.photos && showPhotos && (
              <section>
                <Swiper
                  pagination={true}
                  modules={[Pagination]}
                  className="mb-5 w-full flex-1"
                >
                  {remember.photos.map((photo: any, index: number) => (
                    <SwiperSlide
                      key={photo.id}
                      className="flex items-center justify-center"
                    >
                      <div className="relative h-[300px]">
                        <Image
                          src={`${BUCKET_URL}${photo.url}`}
                          alt="diary image"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-end px-2 text-[10px] font-medium text-default-400">
                        {index + 1} / {remember.photos?.length}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>
            )}

            {/* 날짜 & 제목 & tags */}
            <section className="flex flex-col gap-1">
              <h1 className="text-base font-semibold text-white">
                {'"' + remember.title + '"'}
              </h1>
              <div className="flex items-center gap-1">
                {remember.feelings
                  .slice(0, showAllTags ? remember.feelings?.length : 3)
                  .map((tag: string, index: number) => (
                    <div
                      key={index}
                      className="border-1 inline-block rounded-full border-default-400 bg-default-300 px-2 py-0.5 text-sm font-semibold text-default-800"
                    >
                      {tag}
                    </div>
                  ))}
                {!showAllTags && remember.feelings?.length > 3 && (
                  <div
                    className="inline-block cursor-pointer rounded-full border-[1px] border-default-400 bg-default-300 px-2 py-0.5 text-sm font-semibold text-default-800 hover:bg-gray-300 focus:outline-none focus:ring-2"
                    onClick={handleShowMoreTags}
                  >
                    +{remember.feelings?.length - 3}
                  </div>
                )}
              </div>
            </section>

            {/* 일기 내용 */}
            <section
              className={
                remember.photos
                  ? `scrollbar-hide max-h-[300px] flex-1 overflow-scroll px-4`
                  : `scrollbar-hide mb-3 max-h-[500px] flex-1 overflow-scroll px-4`
              }
            >
              <p className="min-h-[100px] break-all text-sm font-light text-white">
                {remember.body}
              </p>

              <div className="flex w-full items-center justify-end gap-1 pb-4">
                <WeatherIcons
                  weatherId={remember.weatherId}
                  className="size-4 fill-current text-white"
                />
                <span className="font-base text-xs text-white">
                  {remember.weather}
                </span>
              </div>
            </section>

            {/* 필름 디자인 */}
            <div className="flex w-full gap-5 px-1 ">
              {Array.from({ length: 20 }, (_, index) => (
                <div
                  key={index}
                  className="h-3 w-2 rounded-[2px] bg-default-500"
                />
              ))}
            </div>
            <div className="flex justify-between px-2 text-[10px] text-default-700 ">
              <div className="flex gap-1">
                <Film className="size-3" />
                <div>7A</div>
              </div>
              <div>8</div>
              <div className="flex gap-1">
                <Film className="size-3" />
                <div>9A</div>
              </div>
              <div>10</div>
              <div className="flex gap-1">
                <Film className="size-3" />
                <div>11A</div>
              </div>
            </div>
          </article>
        )}
      </Box>
    </Modal>
  );
}
