import { FieldError, UseFormRegister } from "react-hook-form";
import { EditFormValues } from "../page";

interface EditInputProps {
  value: "username" | "email" | "nickname" | "phone" | "body";
  label: string;
  // placeholder: string;
  register: UseFormRegister<any>;
  // error?: any;
}

export default function EditInput({
  value,
  label,
  // placeholder,
  register,
  // error,
}: EditInputProps) {
  return (
    <div>
      <div className="flex flex-col">
        <label
          htmlFor={value}
          className="text-sm font-semibold text-default-800"
        >
          {label}
        </label>
        <input
          id={value}
          {...register(value)}
          className={`placehoder:text-default-500 border-b-2 border-default-400 bg-transparent p-2 hover:border-default-800 hover:placeholder:text-default-600 focus:border-default-900 focus:outline-none focus:placeholder:text-default-500`}
        />
      </div>
      <span></span>
    </div>
  );
}
