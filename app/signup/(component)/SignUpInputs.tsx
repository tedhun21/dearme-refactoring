"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import SignUpInput from "./SignUpInput";
import Loading from "@/public/common/Loading";
import { checkEmail, checkNickname, createUser } from "@/api/user/api";

export interface SignUpFormValues {
  username: string;
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
  username: yup
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
  const router = useRouter();
  const [signupErrorMessage, setSignupErrorMessage] = useState("");

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

  const { username, email, nickname, password, confirmPassword } = getValues();
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

  const { mutate: createUserMutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      window.alert(data.message);
      router.push("/login");
    },
    onError: (err) => {
      setSignupErrorMessage(
        "Please try again due to an error during registration.",
      );
    },
  });

  // 회원가입 처리하는 로직
  const onSubmit = async (data: IFormSignupInputs) => {
    const { username, email, nickname, password, isChecked } = data;

    if (
      username.length > 1 &&
      emailRegex.test(email) &&
      nickname.length > 1 &&
      password.length > 1 &&
      isChecked
    ) {
      createUserMutate({ username, email, nickname, password });
    }
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
          formName="username"
          getValue={username}
          register={register}
          error={errors.username}
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
            className={`text-sm text-default-800 underline hover:text-default-600 ${
              errors.isChecked ? "text-red-500" : ""
            }`}
          >
            AGREE TO TERMS AND SERVICES
          </label>
        </div>

        <button
          type="submit"
          className="group w-full rounded-3xl border-2 border-default-800 py-2 hover:bg-default-800 active:bg-default-900"
        >
          {isPending ? (
            <Loading />
          ) : (
            <span className="font-semibold text-default-800 group-hover:text-default-200 group-active:text-default-800">
              Create account
            </span>
          )}
        </button>
        <span>{signupErrorMessage}</span>
      </form>
      <section className="flex items-center justify-between gap-2 p-2 text-sm">
        <span className="text-gray-500">Already have an account?</span>
        <Link href="/login" className="text-default-900">
          Login here
        </Link>
      </section>
    </section>
  );
}
