"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as yup from "yup";

import { getMe, updateMe } from "@/store/api";
import { Switch } from "@mui/material";

import EditInput from "./components/EditInput";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "@/public/common/Loading";

export interface EditFormValues {
  private: boolean;
  username: string;
  email: string;
  nickname: string;
  phone: string;
  body: string;
}

const editInputList: Array<{
  id: number;
  value: keyof Omit<EditFormValues, "private">;
  label: string;
}> = [
  { id: 1, value: "username", label: "Name" },
  { id: 2, value: "email", label: "Email" },
  { id: 3, value: "nickname", label: "Nickname" },
  { id: 4, value: "phone", label: "Phone" },
  { id: 5, value: "body", label: "Introduce" },
];

const phoneRegex = /^010\d{8}$/;

const editSchema = yup.object({
  username: yup
    .string()
    .min(2, "Name must be at least 2 characters.")
    .required("Please enter your name."),
  email: yup
    .string()
    .email("Please enter in email format.")
    .required("Please enter your email."),
  nickname: yup
    .string()
    .min(2, "Nickname must be at least 2 characters.")
    .required("Please enter your nickname"),
  phone: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue.trim() === "" ? null : value;
    })
    .matches(phoneRegex, "Phone must be 11 characters and start with 010."),

  body: yup.string(),
  private: yup.boolean().required(),
});

export default function MeEdit() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 나의 기존 데이터 가져오기
  const { isSuccess, data: me } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(editSchema) });

  // 유저 프로필 업데이트
  const { isPending, mutate: updateProfileMutate } = useMutation({
    mutationFn: updateMe,

    onMutate: async (data: any) => {
      await queryClient.cancelQueries({ queryKey: ["getMe"] });

      const prevMe = queryClient.getQueryData(["getMe"]);

      queryClient.setQueryData(["getMe"], (old: any) => ({
        ...old,
        ...data.updateData,
      }));

      return { prevMe };
    },
    onSuccess: ({ data }: any) => {
      window.alert(data.message);
      router.push("/me");
    },
    onError: (err: any, _, context) => {
      setError(err.response.data.error.details.field, {
        type: "manual",
        message: err.response.data.error.message,
      });
    },
  });

  const onSubmit = (updateData: any) => {
    // // 빈 스트링 제거
    // Object.keys(updateData).forEach((key) => {
    //   if (updateData[key] === "" || updateData[key] == null) {
    //     delete updateData[key];
    //   }
    // });
    updateProfileMutate({
      userId: me.id,
      updateData: { ...updateData },
    } as any);
  };

  useEffect(() => {
    if (isSuccess && !me) {
      window.alert("login again");
      router.push("/");
    } else if (isSuccess && me) {
      setValue("private", me.private ?? false);
      setValue("username", me.username ?? "");
      setValue("email", me.email ?? "");
      setValue("nickname", me.nickname ?? "");
      setValue("phone", me.phone ?? "");
      setValue("body", me.body ?? "");
    }
  }, [isSuccess, me]);

  return (
    <section className="mb-20 mt-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-10"
      >
        <div>
          <label>Private</label>
          <Controller
            name="private"
            control={control}
            render={({ field }) => (
              <Switch
                {...field}
                checked={field.value ?? false}
                onChange={field.onChange}
                sx={{
                  /// switch 기본 박스 크기
                  padding: 0,
                  width: "32px",
                  height: "20px",
                  "& .MuiSwitch-switchBase": {
                    padding: 0,
                    margin: "2px",
                    transitionDuration: "300ms",
                    /// 체크될때
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
        {editInputList.map((list) => (
          <EditInput
            key={list.id}
            value={list.value}
            label={list.label}
            register={register}
          />
        ))}
        <button
          type="submit"
          className="group w-full rounded-3xl border-2 border-default-800 py-2 hover:bg-default-800 active:bg-default-900"
        >
          {isPending ? (
            <Loading />
          ) : (
            <span className="font-semibold text-default-800 group-hover:text-default-200 group-active:text-default-800">
              Edit Profile
            </span>
          )}
        </button>
      </form>
    </section>
  );
}
