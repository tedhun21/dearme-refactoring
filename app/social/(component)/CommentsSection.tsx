"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";

import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { useInView } from "react-intersection-observer";

import Comment from "./Comment";
import Loading from "@/public/common/Loading";
import UserWithNoImage from "@/public/social/UserWithNoImage";
import { createComment, getCommentsWithPage } from "@/api/comment/api";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function CommentsSection({
  me,
  post,
  commentSettings,
}: {
  me: any;
  post: any;
  commentSettings: string;
}) {
  const queryClient = useQueryClient();
  const [ref, inView] = useInView();

  // Create _ comment
  const [comment, setComment] = useState<string>("");

  // Read _ comments
  const {
    isPending: isCommentPending,
    data: commentData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any[], Error>({
    queryKey: ["getCommentsWithPage", post.id],
    queryFn: ({ pageParam }) =>
      getCommentsWithPage({ postId: post.id, pageParam }),
    getNextPageParam: (lastPage, allPages: any) => {
      const maxPage = lastPage.length / 5;
      const nextPage = allPages.length + 1;

      return maxPage < 1 ? undefined : nextPage;
    },
    initialPageParam: 1,
  });

  const { isPending: isCreateCommentPending, mutate: createCommentMutate } =
    useMutation({
      mutationFn: createComment,
      onMutate: async ({ postId, comment }) => {
        await queryClient.cancelQueries({
          queryKey: ["getCommentsWithPage", post.id],
        });

        const previousComments = queryClient.getQueryData([
          "getCommentsWithPage",
          post.id,
        ]);

        queryClient.setQueryData(
          ["getCommentsWithPage", post.id],
          (old: any) => {
            const newComment = {
              id: new Date().getTime(),
              body: comment,
              createdAt: new Date().toISOString(),
              user: {
                id: me.id,
                nickname: me.nickname,
                photo: me.photo,
              },
            };

            return {
              ...old,
              pages: [[newComment, ...old.pages[0]], ...old.pages.slice(1)],
            };
          },
        );

        return { previousComments };
      },
      onSuccess: () => {
        setComment("");
      },
      onError: (err: any, { postId, comment }: any, context: any) => {
        queryClient.setQueryData(
          ["getCommentsWithPage", postId],
          context.previousComments,
        );

        window.alert(err.response.data.error.message);
      },
    });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createCommentMutate({ postId: post.id, comment });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    if (!inView) {
      return;
    }
    fetchNextPage();
  }, [inView]);

  return (
    <>
      {!isCommentPending && commentData?.pages[0].length !== 0 ? (
        <section className="flex max-h-[240px] flex-col gap-2 overflow-y-scroll">
          {commentData?.pages.map(
            (page: any) =>
              page?.map((comment: any) => (
                <Comment
                  key={comment.id}
                  me={me}
                  post={post}
                  comment={comment}
                />
              )),
          )}
          {/* TODO 댓글 5개  */}
          {hasNextPage && (
            <div ref={ref} className="text-center">
              <Loading className="text-black" />
            </div>
          )}
        </section>
      ) : isCommentPending ? (
        <div className="text-center">
          <Loading className="text-black" />
        </div>
      ) : null}

      {/* 댓글 작성 */}
      {me && commentSettings !== "OFF" && (
        <section className="flex items-center gap-2 px-3">
          <div className="relative size-9 overflow-hidden rounded-full">
            {(me as any).photo ? (
              <Image
                src={`${BUCKET_URL}${(me as any).photo.url}`}
                alt="user image"
                fill
              />
            ) : (
              <UserWithNoImage className="h-full w-full" />
            )}
          </div>

          <div className="relative flex w-full items-center">
            <input
              value={comment}
              onChange={handleInputChange}
              className="w-full flex-grow rounded-full border-2 border-default-400 bg-transparent px-3 py-2 text-sm font-medium transition placeholder:font-normal placeholder:text-default-400 hover:border-default-800 focus:border-default-900 focus:outline-none"
              placeholder="Add a comment..."
            />
            {comment && (
              <button
                type="submit"
                onClick={(e) => handleSubmit(e)}
                disabled={isCreateCommentPending}
              >
                <ArrowUpCircleIcon className="absolute right-2 top-1 size-8 text-default-800 hover:text-default-600 active:text-default-900" />
              </button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
