import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { FieldError, UseFormRegister } from "react-hook-form";
import { SignUpFormValues } from "./SignUpInputs";

interface SignUpInputProps {
  label: "Name" | "Email" | "Nickname" | "Password" | "Confirm Password";
  formName: "username" | "email" | "nickname" | "password" | "confirmPassword";
  getValue: string;
  register: UseFormRegister<SignUpFormValues>;
  error?: FieldError;
}

export default function SignUpInput({
  label,
  formName,
  getValue,
  register,
  error,
}: SignUpInputProps) {
  return (
    <div className="relative flex w-full flex-col gap-1">
      <label htmlFor={label} className="text-sm text-default-500">
        {label}
      </label>
      <input
        id={label}
        type={
          formName === "password" || formName === "confirmPassword"
            ? "password"
            : "text"
        }
        placeholder={label === "Email" ? "example@domain.com" : ""}
        {...register(formName)}
        className="rounded-none border-b-2 border-default-400 bg-transparent p-1 hover:border-default-800 focus:border-default-900 focus:outline-none"
      />
      <span className="text-sm text-red-500">{error && error.message}</span>
      <div className="absolute right-2 top-8">
        {!error?.message && getValue?.length > 1 ? (
          <CheckIcon className="size-5 text-default-900" />
        ) : error?.message ? (
          <XMarkIcon className="size-5 text-red-500" />
        ) : null}
      </div>
    </div>
  );
}
