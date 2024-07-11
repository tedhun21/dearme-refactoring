"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

import ChooseMood from "@/app/[date]/diary/(component)/ChooseMood";
import ChooseEmotionTags from "@/app/[date]/diary/(component)/ChooseEmotionTags";

import UploadPhoto from "@/app/[date]/diary/(component)/UploadPhoto";
import UploadTodayPick from "@/app/[date]/diary/(component)/UploadTodayPick";
import DiaryModal from "@/app/[date]/diary/(component)/DiaryModal";

import { getDiaryDate } from "@/util/date";
import Loading from "@/public/common/Loading";
import ChooseCompanions from "@/app/[date]/diary/(component)/ChooseCompanions";
import { createDiary } from "@/api/diary/api";
import { createTodayPick } from "@/api/today-pick/api";

function removeAllEmptyStrings(obj: any) {
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      typeof obj[key] === "string" &&
      obj[key].trim() === ""
    ) {
      delete obj[key];
    }
  }
  return obj;
}
interface Pick {
  title: string;
  date: Date;
  contributors: string;
  image: File;
}

export default function Create() {
  const router = useRouter();
  const { date } = useParams<{ date: string }>();

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [selectedPicks, setSelectedPicks] = useState<Pick[]>([]);

  const { register, watch, getValues, setValue, handleSubmit, control, reset } =
    useForm({
      defaultValues: {
        mood: "",
        feelings: "",
        companions: "",
        title: "",
        body: "",
        weather: "",
        weatherId: "",
      },
    });

  // 다이어리 생성
  const { isPending: isCreateDiaryPending, mutate: createDiaryMutate } =
    useMutation({
      mutationKey: ["createDiary"],
      mutationFn: createDiary,

      onSuccess: async ({ diaryId }: any) => {
        if (selectedPicks.length > 0) {
          for (let i = 0; i < selectedPicks.length; i++) {
            const { image, ...createData } = selectedPicks[i];
            await createTodayPickMutate({
              createData,
              diaryId,
              image,
            });
          }
        }
        router.replace(`/${date}/diary`);
      },
      onError: ({ response }: any) => {
        window.alert(response.data.error.message);
      },
    });

  // today pick 생성
  const { mutate: createTodayPickMutate } = useMutation({
    mutationKey: ["createTodayPick"],
    mutationFn: createTodayPick,
  });

  const onSubmit = (data: any) => {
    const { mood, feelings, companions, title, body } = data;
    if (
      mood !== "" &&
      feelings !== "" &&
      companions !== "" &&
      title !== "" &&
      body !== ""
    ) {
      const modifiedData = removeAllEmptyStrings(data);
      createDiaryMutate({
        date,
        createData: modifiedData,
        photos: selectedPhotos,
      });
    } else {
      window.alert("Mood, Feelings, With, Diary are required");
    }
  };

  return (
    <main className="flex min-h-screen justify-center">
      <article className="flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 shadow-lg">
        <section className="flex items-center justify-between bg-default-100 px-8 py-4 text-center text-xl font-medium text-gray-400">
          {getDiaryDate(date)}
          <button type="button" onClick={() => router.back()}>
            <ArrowUturnLeftIcon className="size-6 stroke-2" />
          </button>
        </section>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full flex-col justify-between"
        >
          <div>
            <section className="flex flex-col gap-2 bg-default-200 p-4">
              <label className="text-lg font-medium text-default-500">
                Mood
              </label>
              <ChooseMood register={register} control={control} />
              <h3 className="text-center text-sm font-medium text-default-500">
                How are you today?
              </h3>
            </section>
            <section className="flex flex-col gap-4 bg-default-200 p-4">
              <label className="text-lg font-medium text-default-500">
                Feelings
              </label>
              <ChooseEmotionTags
                register={register}
                setValue={setValue}
                control={control}
              />
            </section>
            <section className="flex flex-col gap-4 bg-default-300 p-4">
              <label className="text-lg font-medium text-default-500">
                With
              </label>
              <ChooseCompanions register={register} control={control} />
            </section>
            <section className="my-4 flex flex-col">
              <DiaryModal
                type="create"
                register={register}
                getValues={getValues}
                setValue={setValue}
              />
            </section>
            <section className="flex flex-col bg-default-400">
              <label className="px-6 pt-4 text-lg font-medium text-default-500">
                Today&#39;s PICTURE
              </label>
              <UploadPhoto
                selectedPhotos={selectedPhotos}
                setSelectedPhotos={setSelectedPhotos}
                previewUrls={previewUrls}
              />
            </section>
            <section className="flex flex-col gap-4 bg-default-800 p-4">
              <label className="text-lg font-medium text-default-100">
                Today&#39;s PICK
              </label>
              <UploadTodayPick
                selectedPicks={selectedPicks}
                setSelectedPicks={setSelectedPicks}
              />
            </section>
          </div>
          <section className="flex items-center justify-center p-4">
            <button
              type="submit"
              className="rounded-3xl border-2 border-default-800 px-32 py-2 text-sm font-semibold text-default-800 hover:bg-default-300 active:bg-default-800 active:text-white"
              disabled={isCreateDiaryPending}
            >
              {isCreateDiaryPending ? <Loading /> : <span>Create Diary</span>}
            </button>
          </section>
        </form>
      </article>
    </main>
  );
}
