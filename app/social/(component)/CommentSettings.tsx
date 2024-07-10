import { MouseEvent, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import Menu from "@mui/material/Menu";

import {
  EllipsisHorizontalIcon,
  FlagIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { deleteComment } from "@/api/comment/api";

interface CommentSettingsProps {
  me: any;
  post: any;
  comment: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  // onEditClick: () => void;
}
export default function CommentSettings({
  me,
  post,
  comment,
  isEditing,
  setIsEditing,
}: CommentSettingsProps) {
  const queryClient = useQueryClient();

  // 게시물 (···)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Delete _ comment
  const deleteMutation = useMutation({
    mutationKey: ["deletedComment"],
    mutationFn: (variables: { postId: number; commentId: number }) => {
      const { postId, commentId } = variables;
      return deleteComment(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const handleDeleteComment = async () => {
    const result = window.confirm("Would you like to delete your comment?");
    if (result) {
      deleteMutation.mutate({ postId: post.id, commentId: comment.id });
      handleClose();
      window.alert("Deleted your comment successfully.");
    }
    handleClose();
  };

  const handleEditClick = () => {
    handleClose();
    setIsEditing(true);
  };
  const handleEditCancel = () => {
    handleClose();
    setIsEditing(false);
  };

  return (
    <>
      {me && (
        <button
          type="button"
          onClick={handleOpen}
          className="rounded-full p-1 hover:bg-default-300"
        >
          <EllipsisHorizontalIcon className="size-5" />
        </button>
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            borderRadius: "16px",
          },
        }}
      >
        <div className="flex flex-col px-2">
          {me.id === comment.user.id && !isEditing ? (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1 rounded-lg p-1 hover:bg-default-200 active:bg-default-300"
            >
              <PencilSquareIcon className="size-5 stroke-2" />
              <span className=" text-sm font-medium text-default-700">
                Edit
              </span>
            </button>
          ) : me.id == comment.user.id && isEditing ? (
            <button
              type="button"
              onClick={handleEditCancel}
              className="flex items-center"
            >
              <XMarkIcon className="size-5" />
              <span className="text-defatul-700 text-sm font-medium">
                Close
              </span>
            </button>
          ) : (
            me.id === comment.user.id ||
            (me.id === post.user.id ? (
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg p-1 hover:bg-default-200 active:bg-default-300"
                onClick={() => handleDeleteComment()}
              >
                <TrashIcon className="size-5 stroke-2 text-red-500" />
                <span className="text-sm font-medium text-red-500">Delete</span>
              </button>
            ) : (
              <button className="hover:bg-defulat-200 flex items-center gap-1 rounded-lg p-1 active:bg-default-300">
                <FlagIcon className="size-5 stroke-2 text-red-500" />
                <span className="text-defulat-700 text-sm font-medium">
                  Report
                </span>
              </button>
            ))
          )}
        </div>
      </Menu>
    </>
  );
}
