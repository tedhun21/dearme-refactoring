import { useState } from "react";

import { useSetRecoilState } from "recoil";
import { useMutation } from "@tanstack/react-query";

import { IconButton, Menu } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { todoListState } from "@/store/atoms";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { deleteMyTodo } from "@/api/todo/api";

export default function TodoMenu({ date, todo, setCanEdit }: any) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const setTodos = useSetRecoilState(todoListState);

  // delete Todo
  const { mutate: deleteTodoMutate, data } = useMutation({
    mutationKey: ["deleteMyTodo"],
    mutationFn: deleteMyTodo,
    onSuccess: ({ data }: any) => {
      setAnchorEl(null);
      setTodos((prev) =>
        prev.filter((prevTodo) => prevTodo.id !== data.todoId),
      );
    },
    onError: ({ response }: any) => {
      window.alert(response.data.error.message);
    },
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // todo delete 버튼
  const handleDeleteTodo = () => {
    deleteTodoMutate({ todoId: todo.id });
  };

  return (
    <div>
      <IconButton id="basic-button" onClick={handleClick}>
        <MoreHorizIcon sx={{ color: "#2D2422" }} />
      </IconButton>
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
            width: "100px",
            borderRadius: "8px",
          },
        }}
      >
        <div className="flex flex-col gap-1 px-2">
          <button
            onClick={() => setCanEdit(true)}
            className="flex items-center gap-1 rounded-md p-1 hover:bg-default-200 active:bg-default-300"
          >
            <PencilSquareIcon className="size-6 stroke-2" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDeleteTodo()}
            className="flex items-center gap-1 rounded-md p-1 hover:bg-default-200 active:bg-default-300"
          >
            <XMarkIcon className="size-6 stroke-2 text-red-500" />
            <span className="text-red-500">Delete</span>
          </button>
        </div>
      </Menu>
    </div>
  );
}
