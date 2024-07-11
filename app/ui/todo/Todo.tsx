import { useEffect, useState } from "react";

import { useSetRecoilState } from "recoil";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import TodoCheckFalseIcon from "@/public/me/TodoCheckFalseIcon";
import TodoCheckTrueIcon from "@/public/me/TodoCheckTrueIcon";
import TodoMenu from "./TodoMenu";
import { todoListState } from "@/store/atoms";

import SendIcon from "@/public/todogoal/SendIcon";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { updateMyTodo, updateMyTodoDone } from "@/api/todo/api";

export default function Todo({ date, todo }: any) {
  const [done, setDone] = useState<boolean>();
  const setTodos = useSetRecoilState(todoListState);

  const [canEdit, setCanEdit] = useState(false);
  const { register, handleSubmit } = useForm();

  // todo done 업데이트
  const { mutate: updateMyTodoDoneMutate } = useMutation({
    mutationKey: ["updateMyTodoDone"],
    mutationFn: updateMyTodoDone,
    onSuccess: (data) => {
      setDone(data.done);
      setTodos((prev) =>
        prev.map((prevTodo) => {
          if (prevTodo.id === data.id) {
            return { ...prevTodo, done: data.done };
          }
          return prevTodo;
        }),
      );
    },
  });

  const handleTodoCheck = () => {
    updateMyTodoDoneMutate({ todoId: todo.id, done: !done });
    setDone((prev) => !prev);
  };

  const { mutate: updateMyTodoBodyMutate } = useMutation({
    mutationKey: ["updateMyTodo"],
    mutationFn: updateMyTodo,
    onSuccess: (data) => {
      setTodos((prev) =>
        prev.map((prevTodo) => {
          if (prevTodo.id === data.id) {
            return { ...data };
          }
          return prevTodo;
        }),
      );
      setCanEdit(false);
    },
  });

  const onSubmit = ({ todoBody }: any) => {
    if (todoBody !== "") {
      updateMyTodoBodyMutate({
        todoId: todo.id,
        updateData: { body: todoBody },
      });
    }
  };

  useEffect(() => {
    setDone(todo.done);
  }, [todo]);

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex flex-grow items-center gap-3">
        <button onClick={() => handleTodoCheck()}>
          {done ? (
            <TodoCheckTrueIcon className="size-6 fill-current text-default-600 hover:text-default-700" />
          ) : (
            <TodoCheckFalseIcon className="size-6 fill-current text-default-600 hover:text-default-700" />
          )}
        </button>
        {canEdit ? (
          <input
            {...register("todoBody")}
            defaultValue={todo.body}
            className="flex-grow bg-default-300 text-sm font-medium text-default-700 focus:bg-default-400 focus:outline-none"
          />
        ) : (
          <span className="text-sm font-medium text-default-700">
            {todo.body}
          </span>
        )}
      </div>
      {canEdit ? (
        <div className="flex gap-1 text-black">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="transistion-all group size-10 p-1 duration-200 hover:p-0 active:p-2"
          >
            <button
              type="submit"
              className="flex h-full w-full items-center justify-center rounded-full bg-default-800 transition-all duration-200 hover:bg-default-900"
            >
              <SendIcon className="size-4 transition-all duration-200 group-hover:h-5 group-hover:w-5 group-active:h-3 group-active:w-3" />
            </button>
          </form>
          <div className="rounded-full hover:bg-default-300">
            <button onClick={() => setCanEdit(false)} className="size-10 p-2">
              <XMarkIcon className="stroke-2" />
            </button>
          </div>
        </div>
      ) : (
        <TodoMenu date={date} todo={todo} setCanEdit={setCanEdit} />
      )}
    </div>
  );
}
