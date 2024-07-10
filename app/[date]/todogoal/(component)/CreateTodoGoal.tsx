import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useRecoilValue } from "recoil";
import { useMutation } from "@tanstack/react-query";

import { createMyTodo } from "@/store/api";
import TodogoalCreateTodo from "./todo/CreateTodo";
import { ISetting, settingState } from "@/store/atoms";
import TodogoalCreateGoal from "./goal/TodogoalCreateGoal";

export default function CreateTodoGoal({ me }: any) {
  const { date } = useParams<{ date: string }>();
  // TODO || GOAL
  const { todogoalTitle } = useRecoilValue<ISetting>(settingState);

  const [createInput, setCreateInput] = useState<boolean>(false);

  const { mutate: createTodoMutate } = useMutation({
    mutationKey: ["createMyTodo"],
    mutationFn: createMyTodo,
  });

  useEffect(() => {
    setCreateInput(false);
  }, [todogoalTitle]);

  return (
    <div className="flex justify-center">
      {todogoalTitle === "Todo" && me ? (
        <TodogoalCreateTodo
          date={date}
          createInput={createInput}
          setCreateInput={setCreateInput}
          createTodoMutate={createTodoMutate}
        />
      ) : todogoalTitle === "Goal" && me ? (
        <TodogoalCreateGoal date={date} />
      ) : (
        <Link href="/login">Login to Create</Link>
      )}
    </div>
  );
}
