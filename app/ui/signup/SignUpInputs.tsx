"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import SignUpInput from "./SignUpInput";
import clsx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { checkEmail, checkNickname } from "@/store/api";

export interface SignUpFormValues {
  name: string;
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  isChecked: boolean;
}

const regex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// yup을 이용한 유효성검사
const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters.")
    .required("Please enter your name."),
  email: yup
    .string()
    .email("Please enter a valid email address.")
    .required("Please enter your email."),
  nickname: yup
    .string()
    .min(2, "Nickname must be at least 2 characters.")
    .required("Please enter your nickname"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .matches(
      regex,
      "Password must contain at least one number and one special character.",
    )
    .required("Please enter your password."),
  confirmPassword: yup.lazy(() => {
    return yup
      .string()
      .required("Please enter your confirm password.")
      .oneOf([yup.ref("password")], "Passwords do not match.");
  }),
  isChecked: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions.")
    .required("You must accept the terms and conditions."),
});

type IFormSignupInputs = yup.InferType<typeof signUpSchema>;

export default function SignUpInputs() {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    // mode: "onChange", // 실시간 유효성 검사를 위해 onChange 모드 설정
  });

  const { name, email, nickname, password, confirmPassword } = getValues();
  const { email: watchEmail, nickname: watchNickname } = watch();

  const { mutate: checkEmailMutate } = useMutation({
    mutationFn: checkEmail,
    onSuccess: (data) => {
      if (data.duplicate === true) {
        setError("email", { message: "This email address is already in use." });
      } else {
        clearErrors("email");
      }
    },
  });

  const { mutate: checkNicknameMutate } = useMutation({
    mutationFn: checkNickname,
    onSuccess: (data) => {
      if (data.duplicate === true) {
        setError("nickname", { message: "This nickname is already in use." });
      } else {
        clearErrors("nickname");
      }
    },
  });

  // 회원가입 처리하는 로직
  const onSubmit = async (data: IFormSignupInputs) => {
    const { name, email, nickname, password } = data;

    console.log(data);

    // try {
    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_API_URL}/auth/local/register`,
    //     {
    //       username: name,
    //       email,
    //       nickname,
    //       password,
    //     },
    //   );

    //   if (
    //     response.data.status === 201 ||
    //     response.data.message === "Successfully create a user."
    //   ) {
    //     alert("회원가입이 완료되었습니다");
    //     router.push("/login");
    //   }
    // } catch (error) {
    //   alert("회원 가입에 실패하였습니다. 다시 시도해 주세요.");
    // }
  };

  // email debounce
  useEffect(() => {
    if (watchEmail && watchEmail !== "" && emailRegex.test(watchEmail)) {
      const debounceEmailTimer = setTimeout(
        () => checkEmailMutate(watchEmail),
        1000,
      );
      return () => clearTimeout(debounceEmailTimer);
    }
  }, [watchEmail, checkEmailMutate]);

  // nickname debounce
  useEffect(() => {
    if (watchNickname && watchNickname !== "" && watchNickname.length > 1) {
      const debounceNicknameTimer = setTimeout(
        () => checkNicknameMutate(watchNickname),
        1000,
      );
      return () => clearTimeout(debounceNicknameTimer);
    }
  }, [watchNickname, checkNicknameMutate]);

  return (
    <section className="flex w-full flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[360px] flex-col items-center gap-4 p-4"
      >
        <SignUpInput
          label="Name"
          formName="name"
          getValue={name}
          register={register}
          error={errors.name}
        />

        <SignUpInput
          label="Email"
          formName="email"
          getValue={email}
          register={register}
          error={errors.email}
        />

        <SignUpInput
          label="Nickname"
          formName="nickname"
          getValue={nickname}
          register={register}
          error={errors.nickname}
        />

        <SignUpInput
          label="Password"
          formName="password"
          getValue={password}
          register={register}
          error={errors.password}
        />
        <SignUpInput
          label="Confirm Password"
          formName="confirmPassword"
          getValue={confirmPassword}
          register={register}
          error={errors.confirmPassword}
        />

        <div className="flex w-full gap-2 pt-8">
          <input
            id="agreeToTermsAndServices"
            type="checkbox"
            {...register("isChecked")}
          />
          <label
            htmlFor="agreeToTermsAndServices"
            className={clsx(
              "text-defalut-800 text-sm underline hover:text-default-600",
              errors.isChecked ? "text-red-500" : "",
            )}
          >
            AGREE TO TERMS AND SERVICES
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-3xl border-2 border-default-800 py-2 font-semibold text-default-800 hover:bg-default-800 hover:text-default-200 active:bg-default-900 active:text-default-800"
        >
          Create account
        </button>
      </form>
      <section className="flex items-center justify-between gap-2 p-2 text-xs">
        <span className="text-gray-500">Already have an account?</span>
        <Link href="/login" className="text-default-900">
          Login here
        </Link>
      </section>
    </section>
  );
}

{
  /* <div className="relative flex w-full flex-col gap-1">
          <label htmlFor="name" className="text-sm text-default-500">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="rounded-none border-b-2 border-default-400 bg-transparent p-1 hover:border-default-800 focus:border-default-900 focus:outline-none"
          />
          <span className="text-sm text-red-500">
            {errors.name && errors.name.message}
          </span>
          <div className="absolute right-2 top-8">
            {!errors.name && getValues("name")?.length > 1 ? (
              <CheckIcon className="size-4 text-default-900" />
            ) : errors.name ? (
              <XMarkIcon className="size-4 text-red-500" />
            ) : null}
          </div>
        </div> */
}

{
  /* <div className="relative flex w-full flex-col gap-1">
          <label htmlFor="email" className="text-sm text-default-500">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="example@domain.com"
            className="rounded-none border-b-2 border-default-400 bg-transparent p-1 hover:border-default-800 focus:border-default-900 focus:outline-none"
          />
          <span className="text-sm text-red-500">
            {errors.email && errors.email.message}
          </span>
          <div className="absolute right-2 top-8">
            {!errors.email && getValues("email")?.length > 2 ? (
              <CheckIcon className="size-4 text-default-900" />
            ) : errors.email && getValues("email") !== "" ? (
              <XMarkIcon className="size-4 text-red-500" />
            ) : null}
          </div>
        </div> */
}

{
  /* <div className="relative flex w-full flex-col gap-1">
<label htmlFor="nickname" className="text-sm text-default-500">
  Nickname
</label>
<input
  id="nickname"
  type="text"
  {...register("nickname", {
    onChange: (e) => handleNicknameInputChange(e),
  })}
  className="rounded-none border-b-2 border-default-400 bg-transparent p-1 hover:border-default-800 focus:border-default-900 focus:outline-none"
/>
<span className="text-sm text-red-500">
  {errors.nickname && errors.nickname.message}
</span>
<div className="absolute right-2 top-8">
  {!errors.nickname && getValues("nickname")?.length > 2 ? (
    <CheckIcon className="size-4 text-default-900" />
  ) : errors.nickname && getValues("nickname") !== "" ? (
    <XMarkIcon className="size-4 text-red-500" />
  ) : null}
</div>
</div> */
}

{
  /* <div className="relative flex w-full flex-col gap-1">
          <label htmlFor="password" className="text-sm text-default-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="rounded-none border-b-2 border-default-400 bg-transparent p-1 hover:border-default-800 focus:border-default-900 focus:outline-none"
          />
          <span className="text-sm text-red-500">
            {errors.password && errors.password.message}
          </span>
          <div className="absolute right-2 top-8">
            {!errors.password && getValues("password")?.length > 2 ? (
              <CheckIcon className="size-5 text-default-900" />
            ) : errors.password && getValues("password") !== "" ? (
              <XMarkIcon className="size-4 text-red-500" />
            ) : null}
          </div>
        </div> */
}

{
  /* <div className="relative flex w-full flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-sm text-default-500">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className="rounded-none border-b-2 border-default-400 bg-transparent p-1 hover:border-default-800 focus:border-default-900 focus:outline-none"
          />
          <span className="text-sm text-red-500">
            {errors.confirmPassword && errors.confirmPassword.message}
          </span>
          <div className="absolute right-2 top-8">
            {!errors.confirmPassword &&
            getValues("confirmPassword")?.length > 2 ? (
              <CheckIcon className="size-5 text-default-900" />
            ) : errors.confirmPassword &&
              getValues("confirmPassword") !== "" ? (
              <XMarkIcon className="size-4 text-red-500" />
            ) : null}
          </div>
        </div> */
}
