import { MouseEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Post } from "@/app/social/page";

import EditPost from "./EditPost";

import Menu from "@mui/material/Menu";

import {
  EllipsisHorizontalIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { deletePost } from "@/api/post/api";

// 나의 게시물 / 친구 게시물 : isMyPost(boolean)
interface PostSettingsProps {
  isMyPost: boolean;
  postId: number;
  postData: Post;
}
export default function PostSettings({
  isMyPost,
  postId,
  postData,
}: PostSettingsProps) {
  const queryClient = useQueryClient();

  // 게시물 (···) 메뉴
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Edit post -> EditPost modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleEditClick = (postId: number) => {
    const result = window.confirm("Would you like to edit your post?");
    if (result) {
      setEditModalOpen(true);
      setAnchorEl(null);
    }
  };

  // Delete post
  const deleteMutation = useMutation({
    mutationKey: ["deletedPost"],
    mutationFn: (variables: { postId: number }) => {
      const { postId } = variables;
      return deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handleDeletePost = async () => {
    const result = window.confirm("Are you sure you want to delete this post?");
    if (result) {
      try {
        deleteMutation.mutate({ postId });
        handleClose();
        window.alert("Deleted your post successfully.");
      } catch (e) {
        console.error(e);
      }
    }
    setAnchorEl(null);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="rounded-full p-1 hover:bg-default-300"
      >
        <EllipsisHorizontalIcon className="size-6" />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiMenu-paper": {
            // backgroundColor: "transparent",
            boxShadow: "none",
            width: "100px",
            borderRadius: "16px",
          },
        }}
      >
        {/* 나의 게시물 or 친구 게시물 */}
        {isMyPost ? (
          <div className="flex flex-col gap-1 px-2">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-default-200"
              onClick={() => handleEditClick(postId)}
            >
              <PencilSquareIcon className="size-5" />
              <span className="text-sm font-medium text-default-700">Edit</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-default-200"
              onClick={() => handleDeletePost()}
            >
              <TrashIcon className="size-5" />
              <span className="text-sm font-medium text-default-700">
                Delete
              </span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1 px-2">
            <button className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-default-200">
              <UserIcon className="size-5 stroke-2" />
              <span className="text-sm font-medium text-default-700">
                About
              </span>
            </button>

            <button className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-default-200">
              <ExclamationCircleIcon className="size-6 stroke-2 text-red-500" />
              <span className="text-sm font-semibold text-default-700">
                Report
              </span>
            </button>
          </div>
        )}
      </Menu>

      {/* 수정 버튼 클릭 */}
      {editModalOpen && (
        <EditPost
          postId={postId}
          postData={postData}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
}
