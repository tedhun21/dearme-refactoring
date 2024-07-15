"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";

import { HashtagIcon } from "@heroicons/react/24/outline";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";

import Header from "@/app/ui/header/Header";
import BackButton from "@/app/ui/Backbutton";
import { getPostsByGoals } from "@/api/post/api";
import ViewPostModal from "./(component)/ViewPostModal";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function SearchResults({ params }: { params: { tag: string } }) {
  const [searchTerm, setSearchTerm] = useState("");

  // # 목표 검색
  const { data: searchPostData } = useQuery({
    queryKey: ["searchGoalData"],
    queryFn: () => getPostsByGoals(searchTerm),
    enabled: searchTerm !== "",
  });

  // 포스트 조회 모달
  const [open, setOpen] = useState(false);

  const [selectedPost, setSetlectedPost] = useState<number | null>(null);

  const handleOpen = (postId: number) => {
    setOpen(true);
    setSetlectedPost(postId);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    try {
      const decoded = decodeURI(params.tag);
      setSearchTerm(decoded);
    } catch (e) {}
  }, []);

  return (
    <main className="relative flex min-h-screen justify-center">
      <div className="flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 shadow-lg">
        <Header />
        <div className="flex items-center px-6">
          <BackButton />
        </div>

        {/* #목표 & 목표 개수 */}
        <section className="flex items-center gap-2 px-5 py-8">
          <div className="flex size-10 items-center justify-center rounded-full bg-white">
            <HashtagIcon className="size-6 stroke-2 text-default-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-default-700">
              #{searchTerm}
            </span>
            <span className="text-xs font-medium text-default-500">
              {searchPostData?.length}{" "}
              {searchPostData?.length <= 1 ? " post" : " posts"}
            </span>
          </div>
        </section>

        <div className="h-[2px] bg-default-400" />
        {/* #목표 관련 포스트 */}
        {searchPostData?.length > 0 ? (
          <section>
            <h1 className="p-5 text-sm font-semibold text-default-700">
              Recent posts
            </h1>
            <div className="grid grid-cols-3 gap-0.5 xs:grid-cols-4">
              {Array.isArray(searchPostData) &&
                searchPostData.map((post: any) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => handleOpen(post.id)}
                    className="flex items-center justify-center"
                  >
                    <div className="relative h-[140px] w-full xs:h-[160px]">
                      <Image
                        src={`${BUCKET_URL}${post.photo.url}`}
                        alt="Post Image"
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
            </div>
          </section>
        ) : (
          <section className="flex h-full w-full items-center justify-center ">
            <div className="flex flex-col items-center">
              <AutoAwesomeMotionIcon className="mb-3 h-10 w-10 text-default-400" />
              <h1 className=" mb-3 text-sm font-semibold text-default-400">
                No posts yet
              </h1>
            </div>
          </section>
        )}

        {selectedPost && (
          <ViewPostModal
            open={open}
            handleClose={handleClose}
            postId={selectedPost}
          />
        )}
      </div>
    </main>
  );
}
