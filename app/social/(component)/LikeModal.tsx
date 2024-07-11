"use client";

import { useQuery } from "@tanstack/react-query";

import Modal from "@mui/material/Modal";
import { XMarkIcon } from "@heroicons/react/24/outline";

import LikeList from "./LikeList";
import { getMe } from "@/api/user/api";
import { getLikeship } from "@/api/friendship/api";

interface LikeModalProps {
  open: boolean;
  handleClose: () => void;
  postId: number;
}

export default function LikeModal({
  open,
  handleClose,
  postId,
}: LikeModalProps) {
  // me
  const { data: me } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

  // likes 목록 친구관계 조회
  const all = me ? false : true;
  const { isSuccess, data: likes } = useQuery({
    queryKey: ["getLikeship", postId],
    queryFn: () => getLikeship({ postId, all }),
    enabled: open,
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="flex items-center justify-center"
    >
      <div className="size-[300px] rounded-lg bg-default-200">
        <div className="flex border-b-2 border-default-300 px-3 py-2">
          <span className="flex-grow text-center">Likes</span>
          <button type="button" onClick={handleClose}>
            <XMarkIcon className="size-5" />
          </button>
        </div>
        {Array.isArray(likes) &&
          likes.map((like: any) => <LikeList key={like.likeId} like={like} />)}
      </div>
    </Modal>
  );
}
