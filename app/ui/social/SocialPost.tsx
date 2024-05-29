/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, likePost } from "@/store/api";

import { Post } from "@/app/social/page";
import LikeModal from "./LikeModal";
import CommentsSection from "./CommentsSection";
import PostSettings from "./PostSettings";

import Divider from "@mui/material/Divider";

import EmptyHeart from "@/public/social/EmptyHeart";
import FullHeart from "@/public/social/FullHeart";
import Comments from "@/public/social/Comments";
import UserWithNoImage from "@/public/social/UserWithNoImage";
import Link from "next/link";

interface SocialPostProps {
  post: Post;
}

// 게시물 작성 시간
export function timeSince(date: string): string {
  const now = new Date();
  const postDate = new Date(date);
  const secondsPast = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (secondsPast < 60) {
    return "just now";
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} minutes ago`;
  }
  if (secondsPast <= 86400) {
    return `${Math.floor(secondsPast / 3600)} hours ago`;
  }
  if (secondsPast <= 2629800) {
    return `${Math.floor(secondsPast / 86400)} days ago`;
  }
  if (secondsPast <= 31557600) {
    return `${Math.floor(secondsPast / 2629800)} months ago`;
  }
  return `${Math.floor(secondsPast / 31557600)} years ago`;
}

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function SocialPost({ post }: SocialPostProps) {
  const queryClient = useQueryClient();

  // me
  const { data: me } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

  // 유저의 게시물 (boolean -> PostSettings)
  const isMe = me?.id === post.user.id;

  // 유저의 게시물 좋아요 상태
  const [liked, setLiked] = useState(
    post.likes.length >= 1 && post.likes.some((like) => like.id === me?.id),
  );

  // like 업데이트
  const { mutate: likeMutate } = useMutation({
    mutationKey: ["likedPost"],
    mutationFn: ({ postId }: { postId: number }) => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPostsWithPage"] });
    },
  });

  const toggleLike = () => {
    setLiked((prevLiked) => !prevLiked);
    likeMutate({ postId: post.id });
  };

  // 좋아요 목록 (LikeModal)
  const [isLikeModalOpen, setIsLikedModalOpen] = useState(false);
  const openLikeModal = () => setIsLikedModalOpen(true);
  const closeLikeModal = () => setIsLikedModalOpen(false);

  // 포스트 body 더보기 (more)
  const maxChars = 70;
  const [isExpanded, setIsExpanded] = useState(false);

  // 댓글 보기 상태
  const [showComments, setShowComments] = useState(false);
  const toggleComments = () => {
    setShowComments((prevShowComments) => !prevShowComments);
  };

  return (
    <>
      <section className="mb-5 flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 ">
        {/* 유저 프로필 & 목표 & 설정 */}
        <div className="relative mb-2 flex  items-center px-5">
          <Link
            key={post.user.id}
            href={`/profile/${post.user.id}`}
            className="flex cursor-pointer"
          >
            <div className="h-10 w-10 rounded-full">
              {post.user?.photo?.url ? (
                <img
                  src={`${BUCKET_URL}${post?.user?.photo?.url}`}
                  alt="User Image"
                  className="h-10  w-10 rounded-full object-cover"
                  width={10}
                  height={10}
                />
              ) : (
                <UserWithNoImage className="mr-4 h-10 w-10 " />
              )}
            </div>

            <div className="flex-col pl-3">
              <div className=" text-base font-bold text-default-700">
                {post.user?.nickname || "Unknown User"}
              </div>
              <div
                className="text-xs font-semibold text-default-500"
                style={{ marginTop: "-4px" }}
              >
                {post.goal ? `#${post.goal.title}` : ""}
              </div>
            </div>
          </Link>

          <div className="ml-auto ">
            <PostSettings isMyPost={isMe} postId={post.id} postData={post} />
          </div>
        </div>

        {/* 게시물 사진 */}
        <div className="relative mt-1  px-5">
          {post.photo?.url && (
            <Image
              src={`${BUCKET_URL}${post.photo?.url}`}
              alt="Post Image"
              priority
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "680px",
                borderRadius: "4px",
              }}
            />
          )}
        </div>

        <div className="my-2 flex items-center justify-between px-5">
          {/* 좋아요 & 댓글 아이콘 */}
          {me && (
            <div className="flex">
              <div
                className={`mr-2 flex transform cursor-pointer items-center transition-all duration-500 ${
                  liked
                    ? "scale-105 text-red-500"
                    : "scale-100 text-default-600"
                }`}
                onClick={toggleLike}
              >
                {liked ? (
                  <FullHeart className="h-6 w-5 fill-current text-red-500" />
                ) : (
                  <EmptyHeart className="h-6 w-5 fill-current text-default-600" />
                )}
              </div>
              {post.commentSettings !== "OFF" && (
                <div className="flex items-center" onClick={toggleComments}>
                  <Comments className="ml-1 h-6 w-5 cursor-pointer fill-current text-default-600" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Likes 목록 */}
        <div className="items-centers  flex px-5">
          <div className="flex">
            {post.likes.slice(0, 3).map((like, index) => (
              <div
                key={like.id}
                className={clsx(
                  "relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-solid border-default-200",
                  index > 0 ? "-ml-4" : "",
                )}
              >
                {like.photo?.url ? (
                  <Image
                    src={`${BUCKET_URL}${like.photo?.url}`}
                    fill
                    sizes="24px"
                    alt={`{like.id}`}
                    className="object-cover"
                  />
                ) : (
                  <UserWithNoImage className="" />
                )}
              </div>
            ))}
          </div>

          <div
            className="ml-2 flex cursor-pointer items-center text-xs font-medium text-default-900"
            onClick={openLikeModal}
          >
            {post.likes.length === 0
              ? ""
              : post.likes.length === 1
                ? `${post.likes.length} Like`
                : `${post.likes.length} Likes`}
          </div>
        </div>

        {/* Like Modal */}
        <LikeModal
          open={isLikeModalOpen}
          handleClose={closeLikeModal}
          postId={post.id}
        />

        {/* 게시물 body */}
        <div className="flex w-full items-start gap-2 px-5 py-2 text-sm font-medium text-default-700">
          <div className="text-sm font-semibold">{post.user?.nickname}</div>

          <div className="flex">
            <span
              className={clsx(
                "flex-auto text-sm font-normal",
                isExpanded ? "break-words" : "line-clamp-2",
              )}
            >
              {post.body}
            </span>
            <span>
              {!isExpanded && post.body.length > maxChars && (
                <button
                  className="flex-1 text-xs"
                  onClick={() => setIsExpanded(true)}
                >
                  more
                </button>
              )}
              {isExpanded && post.body.length > maxChars && (
                <button
                  className="flex-1  text-xs"
                  onClick={() => setIsExpanded(false)}
                >
                  hide
                </button>
              )}
            </span>
          </div>
        </div>

        {/* 게시글 작성시간 */}
        <div className="flex w-full justify-end pr-5  text-xs  text-default-500">
          {timeSince(post.createdAt)}
        </div>

        {/* View n Comments */}
        {post.commentSettings !== "OFF" && (
          <div
            className="cursor-pointer px-5 text-xs font-medium text-default-500"
            onClick={toggleComments}
          >
            {!showComments &&
              (post.comments === 0
                ? ""
                : post.comments === 1
                  ? "View 1 comment"
                  : `View all ${post.comments} comments`)}
          </div>
        )}

        {/* 댓글 보기 */}
        {showComments && (
          <CommentsSection
            postId={post.id}
            commentSettings={post.commentSettings}
          />
        )}
        <Divider sx={{ border: "1px solid #EBE3D5", marginTop: "20px" }} />
      </section>
    </>
  );
}
