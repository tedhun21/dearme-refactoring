"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getDiaryDate } from "@/util/date";

import {
  createTodayPick,
  deleteImage,
  getDiaryForDay,
  updateDiary,
} from "@/store/api";
import ChooseMood from "@/app/[date]/diary/(component)/ChooseMood";
import ChooseEmotionTags from "@/app/[date]/diary/(component)/ChooseEmotionTags";
import ChooseCompanions from "@/app/[date]/diary/(component)/ChooseCompanions";
import DiaryModal from "@/app/[date]/diary/(component)/DiaryModal";
import UploadPhoto from "@/app/[date]/diary/(component)/UploadPhoto";
import UploadTodayPick from "@/app/[date]/diary/(component)/UploadTodayPick";
import { CircularProgress } from "@mui/material";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import Loading from "@/public/common/Loading";

interface Pick {
  title: string;
  date: Date;
  contributors: string;
  image: File;
}

export default function Edit() {
  const { date } = useParams<any>();
  const router = useRouter();

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

  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [picks, setPicks] = useState([]);
  const [selectedPicks, setSelectedPicks] = useState<Pick[]>([]);

  // fetch the diary
  const { isSuccess, data: diaryData } = useQuery({
    queryKey: ["getDiaryForDay"],
    queryFn: () => getDiaryForDay({ date }),
  });

  // update the diary
  const { isPending: isUpdateDiaryPending, mutate: updateDiaryMutate } =
    useMutation({
      mutationKey: ["updateDiary"],
      mutationFn: updateDiary,
      onSuccess: async ({ diaryId }) => {
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

        router.push(`/${date}/diary`);
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
      if (data && diaryData)
        updateDiaryMutate({
          updateData: data,
          photos: selectedPhotos,
          diaryId: diaryData.id,
        });
    } else {
      window.alert("Mood, Feelings, With, Diary are required");
    }
  };

  useEffect(() => {
    if (isSuccess && diaryData) {
      setPreviewUrls(diaryData.photos ?? []);
      setPicks(diaryData.today_picks);

      setValue("mood", diaryData.mood);
      setValue("feelings", JSON.parse(diaryData.feelings));
      setValue("companions", diaryData.companions);
      setValue("title", diaryData.title);
      setValue("body", diaryData.body);
      setValue("weatherId", diaryData.weatherId);
      setValue("weather", diaryData.weather);
    }
  }, [isSuccess, diaryData]);

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
                type="edit"
                getValues={getValues}
                setValue={setValue}
                serverData={diaryData}
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
                setPreviewUrls={setPreviewUrls}
              />
            </section>
            <section className="flex flex-col gap-4 bg-default-800 p-4">
              <label className="text-lg font-medium text-default-100">
                Today&#39;s PICK
              </label>
              <UploadTodayPick
                selectedPicks={selectedPicks}
                setSelectedPicks={setSelectedPicks}
                serverData={diaryData?.today_picks}
              />
            </section>
          </div>
          <section className="m-4 flex items-center justify-center">
            <button
              type="submit"
              disabled={isUpdateDiaryPending}
              className="rounded-3xl border-2 border-default-800 px-32 py-2 text-sm font-semibold text-default-800 hover:bg-default-300 active:bg-default-800 active:text-white"
            >
              {isUpdateDiaryPending ? <Loading /> : <span>Update Diary</span>}
            </button>
          </section>
        </form>
      </article>
    </main>
  );
}

{
  /* <div>
  <section className="flex flex-col gap-4 bg-default-200">
    <h2 className="flex px-8 py-4 text-lg font-medium text-gray-400">Mood</h2>
    <ChooseMood
      selectedMood={selectedMood}
      setSelectedMood={setSelectedMood}
      onMoodSelect={(mood: any) => setValue("mood", mood)}
    />
    <h3 className="flex justify-center text-sm font-medium text-gray-400">
      How are you today?
    </h3>
  </section>

  <section className="flex flex-col bg-default-200">
    <h2 className="flex px-8 py-4 text-lg font-medium text-gray-400">
      Feelings
    </h2>
    <ChooseEmotionTags
      selectedTags={selectedTags}
      setSelectedTags={setSelectedTags}
      onTagSelect={(tags: any) => setValue("feelings", tags)}
    />
  </section>

  <section className="flex flex-col bg-default-300 px-8 py-4">
    <h2 className="flex text-lg font-medium text-gray-400">With</h2>
    <ChooseCompanions
      selectedCompanions={selectedCompanions}
      setSelectedCompanions={setSelectedCompanions}
      onSelectCompanion={(companions: any) =>
        setValue("companions", companions)
      }
    />
  </section>

  <section className="relative my-4 flex flex-col rounded bg-default-100 shadow-xl hover:bg-gray-300">
    <DiaryModal type="edit" getValues={getValues} setValue={setValue} />
  </section>

  <section className="flex flex-col bg-default-400 px-5 py-4">
    <h2 className="flex  text-lg font-medium text-gray-400">
      Today&#39;s PICTURE
    </h2>
    <UploadPhoto
      selectedPhotos={selectedPhotos}
      setSelectedPhotos={setSelectedPhotos}
      previewUrls={previewUrls}
      setPreviewUrls={setPreviewUrls}
    />
  </section>

  <section className="flex flex-col gap-2 bg-default-800 px-5 pb-8 pt-4">
    <h2 className="flex text-lg font-medium text-default-100">
      Today&#39;s PICK
    </h2>
    <UploadTodayPick
      picks={picks}
      setPicks={setPicks}
      selectedPicks={selectedPicks}
      setSelectedPicks={setSelectedPicks}
    />
  </section>
</div>; */
}
