"use client";

import { useQuery } from "@tanstack/react-query";

import Footer from "../ui/footer/Footer";

import SearchTitle from "@/public/search/SearchTitle";
import BackIcon from "@/public/common/BackIcon";
import SearchBar from "./(component)/SearchBar";
import { getMe } from "@/api/user/api";

export default function Search() {
  // me
  const { data: meData } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

  return (
    <main className="relative flex min-h-screen justify-center">
      <div className="flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 pb-[52px] shadow-lg">
        <header className="pl-8 pt-8">
          <a href="/">
            <BackIcon />
          </a>
        </header>
        <section className="flex w-full pl-[64px] pt-[36px]">
          <SearchTitle />
        </section>

        <div className="m-5">
          {/* 검색 */}
          <SearchBar />
        </div>

        <Footer />
      </div>
    </main>
  );
}
