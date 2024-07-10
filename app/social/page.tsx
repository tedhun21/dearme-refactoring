"use client";

import "../globals.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useInView } from "react-intersection-observer";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getMe, getPostWithPage } from "@/store/api";

import { CircularProgress } from "@mui/material";

import Header from "../ui/header/Header";
import Tabs from "./(component)/Tabs";
import SocialPost from "./(component)/SocialPost";
import New from "./(component)/New";
import CreatePost from "./(component)/CreatePost";
import Footer from "../ui/footer/Footer";
import Loading from "@/public/common/Loading";
// post type
export interface Photo {
  id: number;
  url: string;
}

export interface User {
  id: number;
  nickname: string;
  photo: Photo | null;
}

export interface Goal {
  id: number;
  title: string;
}

export interface Like {
  id: number;
  nickname: string;
  photo: Photo;
}

export interface Post {
  id: number;
  photo: Photo;
  body: string;
  createdAt: string;
  public: boolean;
  commentSettings: "ALL" | "FRIENDS" | "OFF";
  user: User;
  goal: Goal;
  comments: number;
  likes: Like[];
}

export default function Social() {
  const router = useRouter();

  // New post
  const [postUploaded, setPostUploaded] = useState(false);

  // me
  const { data: meData } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

  // Tab (query)
  const [selectedTab, setSelectedTab] = useState<string>("all");

  useEffect(() => {
    if (!meData && selectedTab === "friends") {
      window.alert("Please log in first.");
      router.replace("/login");
    }
  }, [meData, selectedTab]);

  // infinite scroll
  const [ref, inView] = useInView();

  const {
    isSuccess: isPostDataSuccess,
    data: postData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<Post[], Error>({
    queryKey: ["getPostsWithPage", selectedTab],
    queryFn: ({ pageParam }) =>
      getPostWithPage({ tab: selectedTab, pageParam: pageParam }),

    getNextPageParam: (lastPage, allPages: any) => {
      if (lastPage) {
        const maxPage = lastPage.length / 6;
        const nextPage = allPages.length + 1;
        return maxPage < 1 ? undefined : nextPage;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (!inView) {
      return;
    }
    fetchNextPage();
  }, [inView]);

  return (
    <main className="flex min-h-screen w-full justify-center">
      <div className="flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 shadow-lg">
        <Header me={meData} />

        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        <section className="relative w-full pb-10">
          {isPostDataSuccess ? (
            postData?.pages[0].length > 0 ? (
              // 데이터 통신을 성공했고 데이터가 있을때
              postData.pages.map(
                (posts: any) =>
                  Array.isArray(posts) &&
                  posts.map((post: any) => (
                    <SocialPost key={post.id} post={post} />
                  )),
              )
            ) : (
              // 데이터 성공했지만 데이터가 없고 다음 페이지도 없을 때
              postData.pages[0].length === 0 &&
              !hasNextPage && (
                <div className="flex justify-center px-5 py-2 text-sm text-default-500">
                  No posts yet
                </div>
              )
            )
          ) : (
            <div className="text-center">
              <Loading className="text-black" />
            </div>
          )}
        </section>
        {isPostDataSuccess && !hasNextPage && (
          // 데이터 통신하고 그 다음 페이지가 없을 때
          <div className="flex flex-col items-center pb-52">
            <div className="px-5 py-2 text-sm text-default-500">
              All posts are loaded.
            </div>
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="rounded-2xl bg-default-500 px-4 py-1 text-white hover:opacity-50"
            >
              <span className="text-sm">to the top</span>
            </button>
          </div>
        )}
        {hasNextPage && (
          <div ref={ref}>
            <Loading />
          </div>
        )}

        {/* 게시물 작성 버튼 */}
        <div className="fixed bottom-0 w-full max-w-[600px]">
          <div className="absolute bottom-24 right-5 flex">
            {meData && <CreatePost setPostUploaded={setPostUploaded} />}
          </div>
        </div>

        {/* New Post */}
        {postUploaded && window.scrollY > 100 && (
          <div className=" fixed top-10 flex w-full max-w-[600px] justify-center">
            <div className="absolute">
              <New setPostUploaded={setPostUploaded} />
            </div>
          </div>
        )}

        <Footer />
      </div>
    </main>
  );
}
