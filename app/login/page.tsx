import Link from "next/link";

import LoginInputs from "../ui/login/LoginInputs";
import BackIcon from "@/public/login/BackIcon";
import DearmeLogo from "@/public/login/DearmeLogo";

export default async function Login() {
  return (
    <main className="flex min-h-screen justify-center">
      <article className="w-full min-w-[360px] max-w-[600px] flex-col bg-BGImg bg-cover bg-top-custom bg-no-repeat">
        <header className="p-8">
          <Link href="/">
            <BackIcon />
          </Link>
        </header>
        <div className="flex justify-center pb-8 pt-12">
          <DearmeLogo />
        </div>
        <LoginInputs />
        <section className="flex w-full flex-col items-center gap-2 pt-12">
          <Link
            href="/forgotpassword"
            className="text-sm font-medium text-default-900 hover:text-default-800"
          >
            Forgot Password?
          </Link>
          <div className="flex w-80 justify-between">
            <h1 className="font-medium text-default-100">
              {"Don't have an account?"}
            </h1>
            <Link
              href="/signup"
              className="flex font-medium text-default-800 underline hover:text-default-900"
            >
              Sign up
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
