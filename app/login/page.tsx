"use client";

import Link from "next/link";

import LoginInputs from "../ui/login/LoginInputs";
import BackIcon from "@/public/login/BackIcon";
import DearmeLogo from "@/public/login/DearmeLogo";

export default function Login() {
  return (
    <main className="flex min-h-screen justify-center">
      <article className="bg-flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 bg-BGImg bg-cover bg-top-custom bg-no-repeat">
        <header className="p-8">
          <Link href="/">
            <BackIcon />
          </Link>
        </header>
        <div className="flex justify-center pb-[24px] pt-[52px]">
          <DearmeLogo />
        </div>
        <LoginInputs />
        <section className="flex w-full justify-center pt-12">
          <Link
            href="/forgotpassword"
            className="text-sm font-medium text-default-900"
          >
            Forgot Password?
          </Link>
        </section>
        <section className="mt-2 flex w-full min-w-[220px] max-w-[280px] justify-center px-2 text-sm">
          <h1 className="flex w-full min-w-[220px] max-w-[280px] pl-8 font-medium text-default-100">
            {"Don't have an account?"}
          </h1>
          <Link
            href="/signup"
            className="flex w-full justify-center whitespace-nowrap pr-12 font-medium text-default-800 underline"
          >
            Sign up
          </Link>
        </section>
      </article>
    </main>
  );
}
