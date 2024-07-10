"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ChatBubbleLeftEllipsisIcon as OutlineComment,
  HeartIcon as EmptyHeart,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftEllipsisIcon as SolidComment,
  HeartIcon as FullHeart,
} from "@heroicons/react/24/solid";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, likePost } from "@/store/api";

import { Post } from "@/app/social/page";
import LikeModal from "./LikeModal";
import CommentsSection from "./CommentsSection";
import PostSettings from "./PostSettings";

import Comments from "@/public/social/Comments";
import UserWithNoImage from "@/public/social/UserWithNoImage";
import { timeAgo } from "@/util/date";

interface SocialPostProps {
  post: Post;
}

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function SocialPost({ post }: SocialPostProps) {
  const queryClient = useQueryClient();

  // 좋아요 목록 (LikeModal)
  const [isLikeModalOpen, setIsLikedModalOpen] = useState(false);
  const openLikeModal = () => setIsLikedModalOpen(true);
  const closeLikeModal = () => setIsLikedModalOpen(false);

  // 포스트 body 더보기 (more)
  const maxChars = 70;
  const [isExpanded, setIsExpanded] = useState(false);

  // 댓글 보기 상태
  const [showComments, setShowComments] = useState(false);

  const [isMe, setIsMe] = useState(false);
  const [liked, setLiked] = useState(false);

  // me
  const { data: meData } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

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

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  // 사용자가 게시물 작성자인지 확인
  useEffect(() => {
    const isUser = meData?.id === post.user.id;
    setIsMe(isUser);
  }, [meData]);

  // 사용자가 게시물을 좋아하는지 확인
  useEffect(() => {
    const likedByMe = post.likes.some((like) => like.id === meData?.id);
    setLiked(likedByMe);
  }, [meData, post.likes]);

  return (
    <article className="flex w-full flex-col gap-2 border-b-2 border-default-400 bg-default-200 p-4">
      {/* 유저 프로필 & 목표 & 설정 */}
      <section className="relative flex items-center justify-between">
        <Link
          key={post.user.id}
          href={`/profile/${post.user.id}`}
          className="flex gap-2"
        >
          <div className="relative size-10 rounded-full">
            {post.user?.photo?.url ? (
              <Image
                src={`${BUCKET_URL}${post?.user?.photo?.url}`}
                alt="user image"
                className="object-cover"
                fill
              />
            ) : (
              <UserWithNoImage className="size-10" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-default-700">
              {post.user?.nickname || "Unknown User"}
            </span>
            <span className="text-xs font-semibold text-default-500">
              {post.goal ? `#${post.goal.title}` : ""}
            </span>
          </div>
        </Link>

        <PostSettings isMyPost={isMe} postId={post.id} postData={post} />
      </section>

      {/* 게시물 사진 */}
      <section className="relative h-[240px] w-full overflow-hidden rounded-sm xxs:h-[280px] xs:h-[340px] s:h-[380px]">
        {post.photo?.url && (
          <Image
            src={`${BUCKET_URL}${post.photo?.url}`}
            alt="Post Image"
            priority
            fill
            className="object-cover"
          />
        )}
      </section>

      {/* 좋아요 & 댓글 아이콘 */}
      <section className="flex items-center justify-between">
        {meData && (
          <div className="flex gap-2">
            <button
              type="button"
              className={`flex transform items-center transition-all duration-500 ${
                liked ? "scale-110 text-red-500" : "scale-100 text-default-600"
              }`}
              onClick={toggleLike}
            >
              {liked ? (
                <FullHeart className="size-6 text-red-500" />
              ) : (
                <EmptyHeart className="size-6 stroke-2 text-default-600" />
              )}
            </button>
            {post.commentSettings !== "OFF" && (
              <button
                type="button"
                className="flex items-center"
                onClick={toggleComments}
              >
                {showComments ? (
                  <SolidComment className="size-6 stroke-2 text-default-600" />
                ) : (
                  <OutlineComment className="size-6 stroke-2 text-default-600" />
                )}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Likes 목록 */}
      {Array.isArray(post.likes) && post.likes.length > 0 ? (
        <section className="flex items-center gap-1">
          <div className="group flex">
            {post.likes.slice(0, 3).map((like, index) => (
              <div
                key={like.id}
                className={`relative flex size-7 items-center justify-center overflow-hidden rounded-full border-2 border-solid border-default-200 transition-all duration-300 ${
                  index > 0 && !showComments ? "-ml-4 group-hover:ml-0" : ""
                } ${showComments ? "ml-0" : ""}`}
              >
                {like.photo?.url ? (
                  <Image
                    src={`${BUCKET_URL}${like.photo?.url}`}
                    alt={`${like.id}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <UserWithNoImage className="" />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="flex items-center text-xs font-medium text-default-900"
            onClick={openLikeModal}
          >
            {post.likes.length === 1
              ? `${post.likes.length} Like`
              : `${post.likes.length} Likes`}
          </button>
        </section>
      ) : null}

      {/* Like Modal */}
      <LikeModal
        open={isLikeModalOpen}
        handleClose={closeLikeModal}
        postId={post.id}
      />

      {/* 게시물 body */}
      <section className="flex w-full items-start gap-2 text-sm font-medium text-default-700">
        <div className="text-sm font-semibold">{post.user?.nickname}</div>

        <div className="flex">
          <span
            className={`flex-auto text-sm font-normal ${
              isExpanded ? "break-words" : "line-clamp-2"
            }`}
          >
            {post.body}
          </span>
          <span>
            {!isExpanded && post.body?.length > maxChars && (
              <button
                type="button"
                className="flex-1 text-xs"
                onClick={() => setIsExpanded(true)}
              >
                more
              </button>
            )}
            {isExpanded && post.body?.length > maxChars && (
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex-1 text-xs"
              >
                hide
              </button>
            )}
          </span>
        </div>
      </section>

      {/* View n Comments */}
      {post.commentSettings !== "OFF" && post.comments > 0 && !showComments && (
        <div>
          <button
            type="button"
            onClick={toggleComments}
            className="text-xs font-medium text-default-500"
          >
            {post.comments === 1
              ? "View 1 comment"
              : `View all ${post.comments} comments`}
          </button>
        </div>
      )}

      {/* 댓글 보기 */}
      {showComments && (
        <CommentsSection
          me={meData}
          post={post}
          commentSettings={post.commentSettings}
        />
      )}
      {/* 게시글 작성시간 */}
      <span className="flex text-xs font-light text-default-500">
        {timeAgo(post.createdAt)}
      </span>
    </article>
  );
}
