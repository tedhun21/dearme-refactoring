import Image from "next/image";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import Loading from "@/public/common/Loading";
import UserWithNoImage from "@/public/social/UserWithNoImage";
import { updateFriendship } from "@/api/friendship/api";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

function buttonText(status: string) {
  if (status === "friend") {
    return "Friend";
  } else if (status === "requested") {
    return "Requested";
  } else if (status === "not found") {
    return "Follow";
  } else if (status === "pending") {
    return "Confirm";
  } else if (status === "blocked user") {
    return "Unblock";
  } else {
    return "Me";
  }
}

export default function LikeList({ like }: any) {
  const queryClient = useQueryClient();

  // Update Friendship
  const {
    isPending: isUpdateFriendshipPending,
    mutate: updateFriendshipMutate,
  } = useMutation({
    mutationFn: updateFriendship,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handleRequest = (friendId: number, status: string) => {
    updateFriendshipMutate({
      friendId,
      status,
    });
  };

  const handleClick = (like: any) => {
    if (like.status === "not found") {
      handleRequest(like.likeId, "request");
    } else if (like.status === "pending") {
      handleRequest(like.likeId, "friend");
    } else if ((like.likeId, "blocked user")) {
      handleRequest(like.likeId, "unblock");
    }
  };
  return (
    <div className="scrollbar-hide flex justify-between overflow-y-scroll px-3 py-1">
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full">
          {like.userPhoto ? (
            <Image
              src={`${BUCKET_URL}${like.userPhoto}`}
              alt="uesr image"
              fill
              className="object-cover"
            />
          ) : (
            <UserWithNoImage className="size-8" />
          )}
        </div>
        <span>{like.nickname}</span>
      </div>
      {/* 친구 요청 버튼 */}
      <button
        onClick={() => handleClick(like)}
        className={`w-20 rounded-lg px-2 py-1 text-xs font-semibold ${
          like.status === "requested" || like.status === "friend"
            ? "bg-default-500 text-white"
            : like.status === "not found"
              ? "bg-default-900 text-white hover:bg-opacity-75"
              : like.status === "pending"
                ? "bg-default-800 text-white hover:bg-opacity-75"
                : like.stats === "blocked user"
                  ? "bg-black text-white hover:bg-opacity-75"
                  : "cursor-default text-black"
        }`}
        disabled={like.status === "requested" || like.status === "friend"}
      >
        {isUpdateFriendshipPending ? <Loading /> : buttonText(like.status)}
      </button>
    </div>
  );
}
