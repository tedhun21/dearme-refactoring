import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

import { timeAgo } from "@/util/date";
import { updateComment } from "@/store/api";
import CommentSettings from "./CommentSettings";
import UserWithNoImage from "@/public/social/UserWithNoImage";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;
export default function Comment({ me, post, comment }: any) {
  const queryClient = useQueryClient();
  // Update _ comment
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingComment, setEditingComment] = useState<string>(comment.body);

  const { isPending: isUpdateCommentPending, mutate: updateCommentMutation } =
    useMutation({
      mutationFn: updateComment,
      onMutate: async ({ postId, commentId, comment }) => {
        await queryClient.cancelQueries({
          queryKey: ["getCommentsWithPage", postId],
        });

        const previousComments = queryClient.getQueryData([
          "getCommentsWithPage",
          postId,
        ]);

        queryClient.setQueryData(
          ["getCommentsWithPage", postId],
          (old: any) => {
            const updatedPages = old.pages.map((page: any) =>
              page.map((cmt: any) =>
                cmt.id === commentId ? { ...cmt, body: comment } : cmt,
              ),
            );

            return { ...old, pages: updatedPages };
          },
        );

        return { previousComments };
      },
      onSuccess: () => {
        window.alert("Updated your comment successfully!");
        setIsEditing(false);
        setEditingComment("");
      },
      onError: (err, { postId, commentId, comment }, context) => {
        queryClient.setQueryData(
          ["getCommentsWithPage", postId],
          context?.previousComments,
        );
      },
    });

  const handleEdit = () => {
    updateCommentMutation({
      postId: post.id,
      commentId: comment.id,
      comment: editingComment,
    });
  };

  return (
    <div className="flex w-full justify-between gap-2 px-2">
      <div className="flex w-full flex-grow items-center">
        <div className="flex w-full items-center gap-3">
          <Link
            href={`/profile/${comment.user?.id}`}
            className="flex items-center gap-2"
          >
            <div className="relative size-8 overflow-hidden rounded-full">
              {comment.user.photo ? (
                <Image
                  src={`${BUCKET_URL}${comment.user.photo.url}`}
                  alt="user image"
                  fill
                />
              ) : (
                <UserWithNoImage className="h-full w-full" />
              )}
            </div>
            <span className="break-keep text-sm font-semibold">
              {comment.user.nickname}
            </span>
          </Link>
          {isEditing ? (
            <div className="relative w-full text-sm font-normal text-default-700">
              <input
                value={editingComment}
                onChange={(e) => setEditingComment(e.target.value)}
                className="w-full whitespace-normal break-all rounded-2xl border-2 border-default-900 bg-transparent px-2 py-1 focus:outline-none "
              />
              <button
                type="button"
                onClick={handleEdit}
                disabled={isUpdateCommentPending}
              >
                <ArrowUpCircleIcon className="absolute right-1 top-1 size-6 text-default-800 hover:text-default-600 active:text-default-900" />
              </button>
            </div>
          ) : (
            <span className="w-full flex-grow whitespace-normal break-all text-sm font-normal text-default-700">
              {comment.body}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="whitespace-nowrap break-keep text-2xs text-default-500">
          {timeAgo(comment.createdAt)}
        </span>
        <CommentSettings
          me={me}
          post={post}
          comment={comment}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>
    </div>
  );
}
