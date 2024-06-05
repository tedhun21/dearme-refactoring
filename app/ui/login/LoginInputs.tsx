import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import LoginInput from "./LoginInput";
import { signIn } from "@/store/api";
import { setCookie } from "@/util/tokenCookie";
import GoogleLogo from "@/public/login/GoogleLogo";
import { CircularProgress, circularProgressClasses } from "@mui/material";

export interface LoginFormValues {
  email: string;
  password: string;
}

const regex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// yup을 이용한 유효성검사
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address format.")
    .required("Please enter your email address."),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .matches(
      regex,
      "Password must contain at least one number and one special character.",
    )
    .required("Please enter your password."),
});

type IFormLoginInputs = yup.InferType<typeof loginSchema>;

export default function LoginInputs() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const { mutate: signInMutate, isPending } = useMutation({
    mutationKey: ["signIn"],
    mutationFn: signIn,
    onSuccess: async ({ jwt }) => {
      await setCookie(jwt);
      router.push("/");
    },
    onError: async () => {
      setError("password", {
        message: "Please check email and password again.",
      });
    },
  });

  // 로그인 처리하는 로직
  const onSubmit = async ({ email, password }: IFormLoginInputs) => {
    if (email && password) {
      signInMutate({ email, password });
    }
  };

  const handleGoogleLogin = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/connect/google`);
  };

  return (
    <section className="flex h-[360px] w-full flex-col items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        name="loginForm"
        autoComplete="on"
        className="flex h-full w-80 flex-col justify-between"
      >
        <div className="flex flex-col gap-4">
          <LoginInput
            type="email"
            placeholder="example@domain.com"
            register={register}
            error={errors.email}
          />
          <LoginInput
            type="password"
            register={register}
            error={errors.password}
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="group flex w-full items-center justify-center rounded-3xl border-2 border-default-800 p-2 hover:bg-default-800 active:bg-default-900"
          >
            {isPending ? (
              <CircularProgress
                variant="indeterminate"
                disableShrink
                size={20}
                thickness={5}
                sx={{
                  color: "#ffffff",
                  animationDuration: "550ms",
                  [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: "round",
                  },
                }}
              />
            ) : (
              <span className="text-sm font-semibold text-default-800 group-hover:text-white">
                Log in
              </span>
            )}
          </button>
          <button
            onClick={handleGoogleLogin}
            className="group flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-default-800 bg-default-800 p-2 text-white hover:bg-default-700 active:bg-default-900"
          >
            <GoogleLogo />
            <span className="text-sm font-semibold group-active:text-default-800">
              Log in with Google
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}
