"use client";

import { useState } from "react";
import axios from "axios";

import Modal from "@mui/joy/Modal";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

import WeatherIcons from "@/app/ui/diary/WeatherIcons";

export default function DiaryModal({ type, getValues, setValue }: any) {
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // 입력된 제목의 길이가 25자를 초과 X
  const handleTitleChange = (e: any) => {
    const input = e.target.value;
    if (input.length <= 25) {
      setTitle(input);
    }
  };

  const getWeather = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lange=en`;
        try {
          const {
            data: { main, name, weather },
          } = await axios.get(url);
          const temp = main.temp.toFixed(1);
          setValue("weather", `${name}, ${temp}°C`);
          setValue("weatherId", weather[0].id);
        } catch (e) {
          console.log(e);
        }
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleComplete = async () => {
    setValue("title", title);
    setValue("body", body);
    await getWeather();

    setModalOpen(false);
  };

  const handleErase = () => {
    setValue("title", "");
    setValue("body", "");
    setValue("weather", "");
    setValue("weatherId", "");

    setModalOpen(false);
  };

  return (
    <>
      {/* when we get value */}
      {getValues().title !== "" || getValues().body !== "" ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="relative rounded-lg bg-default-100 px-5 py-4 shadow-xl hover:bg-default-900"
        >
          <div className="flex flex-col gap-4 pb-16 pt-8">
            <h3 className="text-lg font-bold">{getValues().title}</h3>
            <p className="break-all pl-1 text-left">{getValues().body}</p>
          </div>
          <div className="absolute bottom-2 right-4 flex items-center gap-2 *:text-default-800">
            <WeatherIcons
              weatherId={getValues().weatherId}
              className="size-6 fill-current"
            />
            <span className="text-xs font-medium">
              {getValues().weather || "No weather data"}
            </span>
          </div>
        </button>
      ) : (
        // when we get no value
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-default-100 px-20 py-8 hover:bg-default-200"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <PlusCircleIcon className="size-8" />

            <span>Feel free to share your precious story with us :)</span>
          </div>
        </button>
      )}
      <Modal open={modalOpen} className="flex items-center justify-center">
        <div className="flex flex-col gap-4 rounded-lg bg-default-100 p-4 xxs:w-[360px] xs:w-[500px]">
          <div className="flex items-center justify-between">
            <label className="flex-grow text-center text-lg font-semibold">
              Diary
            </label>
            <button
              onClick={handleCloseModal}
              type="button"
              className="ml-auto"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-semibold">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e)}
                placeholder="Please write within 25 characters."
                className="w-full rounded-md border-2 border-default-300 px-3 py-1 outline-none hover:border-default-400 hover:bg-default-100 focus:border-default-900 focus:bg-default-200"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="content" className="text-sm font-semibold">
                Content
              </label>
              <textarea
                id="content"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Please write a diary"
                className="min-h-60 rounded-md border-2 border-default-300 px-3 py-1 outline-none hover:border-default-400 hover:bg-default-100 focus:border-default-900 focus:bg-default-200"
              />
            </div>
          </div>
          <div className="flex justify-center gap-8 px-4 py-2">
            <button
              type="button"
              className="rounded-md bg-default-300 px-5 text-center text-sm font-semibold text-default-800 hover:bg-default-400"
              onClick={handleErase}
            >
              Erase
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="rounded-md bg-default-800 px-4 py-2 text-sm font-semibold text-default-100 hover:bg-default-900"
            >
              Write
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
