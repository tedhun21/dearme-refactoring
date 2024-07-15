"use client";

import Link from "next/link";

import Footer from "../ui/footer/Footer";

import SearchTitle from "@/public/search/SearchTitle";
import SearchBar from "./(component)/SearchBar";
import BackButton from "../ui/Backbutton";

export default function Search() {
  return (
    <main className="relative flex min-h-screen justify-center">
      <div className="flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 pb-[52px] shadow-lg">
        <header className="p-6">
          <Link href="/">
            <BackButton />
          </Link>
        </header>
        <section className="flex w-full p-8">
          <SearchTitle />
        </section>

        <section className="p-5">
          {/* 검색 */}
          <SearchBar />
        </section>

        <Footer />
      </div>
    </main>
  );
}
