import Link from "next/link";

import BackIcon from "@/public/common/BackIcon";
import SignupTitle from "@/public/signup/SignupTitle";
import SignUpInputs from "../ui/signup/SignUpInputs";

export default async function Signup() {
  return (
    <main className="flex min-h-screen justify-center">
      <article className="flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 shadow-lg">
        <header className="p-8">
          <Link href="/">
            <BackIcon />
          </Link>
        </header>
        <section className="flex w-full px-16 py-10">
          <SignupTitle />
        </section>
        <SignUpInputs />
      </article>
    </main>
  );
}
