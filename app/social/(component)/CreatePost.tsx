"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Modal from "@mui/material/Modal";
import { Switch } from "@mui/material";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

import UploadPostImg from "./UploadPostImg";
import Loading from "@/public/common/Loading";
import { getGoals, createPost } from "@/store/api";
import { getToday, monthNameDayYear } from "@/util/date";

interface IForm {
  goalId: number;
  isPrivate: boolean;
  body: string;
  commentSettings: string;
}

export default function CreatePost({
  setPostUploaded,
}: {
  setPostUploaded: (status: boolean) => void;
}) {
  const queryClient = useQueryClient();

  // CreatePost modal
  const [openCreatePost, setOpenCreatePost] = useState(false);

  // 게시물 사진
  const [imageFile, setImageFile] = useState<File | null>(null);
  const handleImageFileChange = (file: File) => {
    setImageFile(file);
  };

  // commentSettings
  const [commentSettingsOptions, setCommentSettingsOptions] = useState<
    string[]
  >([]);

  // react-hook-form
  const { register, setValue, handleSubmit, reset, watch, control } =
    useForm<IForm>({
      defaultValues: {
        goalId: 0,
        isPrivate: false,
        body: "",
        commentSettings: "",
      },
    });

  const isPrivate = watch("isPrivate");

  // goals
  const { data: goalData } = useQuery({
    queryKey: ["getGoals"],
    queryFn: () => getGoals(getToday()),
    enabled: openCreatePost,
  });

  // Post Request
  const { isPending: isCreatePostPending, mutate: createPostMutation } =
    useMutation({
      mutationKey: ["createPost"],
      mutationFn: createPost,
      onSuccess: () => {
        setOpenCreatePost(false);
        window.alert(" Uploaded!");
        setPostUploaded(true);

        reset();
      },
      onError: () => {
        window.alert(" Failed to upload your post.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["getPostsWithPage"],
        });
      },
    });

  const onSubmit = (data: any) => {
    if (data.goalId === 0) {
      window.alert("Please select your goal.");
      return;
    } else if (!imageFile) {
      window.alert("Please select a photo.");
      return;
    }

    createPostMutation({ createData: data, imageFile });
  };

  useEffect(() => {
    if (openCreatePost && goalData && goalData.length === 0) {
      setOpenCreatePost(false);
      window.alert(
        "You have no goals. Please register a goal before creating a post.",
      );
    }
  }, [goalData, openCreatePost]);

  useEffect(() => {
    const newCommentSettingsOptions = isPrivate
      ? ["FRIENDS", "OFF"]
      : ["ALL", "OFF"];
    setCommentSettingsOptions(newCommentSettingsOptions);

    const newCommentSettings = isPrivate ? "FRIENDS" : "ALL";
    setValue("commentSettings", newCommentSettings);
  }, [isPrivate, setValue]);

  return (
    <>
      <button
        className="flex size-10 items-center justify-center rounded-full bg-default-800 hover:bg-opacity-75"
        onClick={() => setOpenCreatePost(true)}
      >
        <PlusIcon className="size-6 stroke-2 text-white" />
      </button>

      {/* CreatePostModal */}
      <Modal
        open={openCreatePost}
        onClose={() => setOpenCreatePost(false)}
        className="flex items-center justify-center"
      >
        <div className="flex h-[700px] flex-col justify-between rounded-2xl bg-default-200 p-6 xxs:w-[360px] xs:w-[500px]">
          <div className="flex items-center justify-between">
            <label className="flex-grow text-center text-lg font-semibold">
              Create Post
            </label>
            <button
              onClick={() => setOpenCreatePost(false)}
              className="ml-auto"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <section className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="goalId"
                    className="font-semibold text-default-500"
                  >
                    In
                  </label>
                  <select
                    {...register("goalId", { required: true })}
                    className="w-52 rounded-2xl border-2 border-default-400 bg-transparent px-2 py-1 focus:outline-none"
                  >
                    <option value={0} className="text-sm">
                      None
                    </option>
                    {Array.isArray(goalData) &&
                      goalData.length > 0 &&
                      goalData.map((goal) => (
                        <option
                          key={goal.id}
                          value={goal.id}
                          className="text-sm"
                        >
                          #{goal.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-sm font-medium text-default-700">
                    Private
                  </label>
                  <Controller
                    control={control}
                    name="isPrivate"
                    render={({ field: { value } }) => (
                      <Switch
                        {...register("isPrivate")}
                        sx={{
                          /// switch 기본 박스 크기
                          marginLeft: 1,
                          padding: 0,
                          width: "32px",
                          height: "20px",
                          "& .MuiSwitch-switchBase": {
                            padding: 0,
                            margin: "2px",
                            transitionDuration: "300ms",
                            // 체크될 때
                            "&.Mui-checked": {
                              transform: "translateX(12px)",
                              color: "#fff",
                              "& + .MuiSwitch-track": {
                                backgroundColor: "#143422",
                                opacity: 1,
                                border: 0,
                              },
                              "&.Mui-disabled + .MuiSwitch-track": {
                                opacity: 0.5,
                              },
                            },
                          },
                          "& .MuiSwitch-thumb": {
                            boxSizing: "border-box",
                            width: 16,
                            height: 16,
                          },
                          "& .MuiSwitch-track": {
                            borderRadius: 26 / 2,
                            backgroundColor: "#b6b6c0",
                            opacity: 1,
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </section>
              <section>
                <UploadPostImg setImageFile={setImageFile} />
              </section>
              <section>
                <span className="text-defulat-700 text-sm font-medium">
                  {monthNameDayYear(dayjs())}
                </span>
              </section>
              <section>
                <textarea
                  {...register("body", { required: true })}
                  rows={6}
                  placeholder="Please write a caption."
                  className="w-full rounded-xl border-2 border-default-400 bg-transparent px-2 py-1 text-sm hover:border-default-800 focus:border-default-900 focus:outline-none"
                />
              </section>
              <section className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="body"
                    className="text-sm font-medium text-default-700"
                  >
                    Comments
                  </label>
                  <select
                    {...register("commentSettings")}
                    className="w- rounded-2xl border-2 border-default-400 bg-transparent px-2 py-1 focus:outline-none"
                  >
                    {commentSettingsOptions.map((option) => (
                      <option key={option} value={option} className="text-sm">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-lg bg-default-800 px-3 py-1 hover:bg-opacity-80 active:bg-default-900"
                  disabled={isCreatePostPending}
                >
                  {isCreatePostPending ? (
                    <Loading />
                  ) : (
                    <span className="font-medium text-white">Post</span>
                  )}
                </button>
              </section>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
