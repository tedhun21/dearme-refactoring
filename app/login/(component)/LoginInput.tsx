import { useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { LoginFormValues } from "./LoginInputs";

interface InputProps {
  type: "email" | "password";
  placeholder?: string;
  register: UseFormRegister<LoginFormValues>;
  error: FieldError | undefined;
}

export default function LoginInput({
  type,
  placeholder,
  register,
  error,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={`flex flex-col ${type === "password" ? "relative" : ""}`}>
        <label
          htmlFor={type}
          className="text-sm font-semibold text-default-800"
        >
          {type === "email" ? "Email" : "Password"}
        </label>
        <input
          id={type}
          type={!showPassword && type === "password" ? "password" : "text"}
          {...register(type)}
          placeholder={placeholder || ""}
          className={`border-b-2 border-default-400 bg-transparent p-2 placeholder:text-default-500 hover:border-default-800 hover:placeholder:text-default-600 focus:border-default-900 focus:outline-none focus:placeholder:text-default-500 ${
            error ? "text-red-600" : ""
          }`}
        />
        {type === "password" ? (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 pt-4 leading-5"
          >
            {showPassword ? (
              <EyeIcon className="size-4 text-default-500" />
            ) : (
              <EyeSlashIcon className="size-4 text-default-500" />
            )}
          </button>
        ) : null}
      </div>

      <span className="min-h-[1.25rem] text-sm text-red-500">
        {error ? error.message : ""}
      </span>
    </div>
  );
}
