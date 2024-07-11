import Link from "next/link";
import { useParams } from "next/navigation";

import { useRecoilValue } from "recoil";

import TodogoalCreateTodo from "./todo/CreateTodo";
import { ISetting, settingState } from "@/store/atoms";
import TodogoalCreateGoal from "./goal/TodogoalCreateGoal";

export default function CreateTodoGoal({ me }: any) {
  const { date } = useParams<{ date: string }>();
  // TODO || GOAL
  const { todogoalTitle } = useRecoilValue<ISetting>(settingState);

  return (
    <div className="flex justify-center">
      {todogoalTitle === "Todo" && me ? (
        <TodogoalCreateTodo date={date} />
      ) : todogoalTitle === "Goal" && me ? (
        <TodogoalCreateGoal date={date} />
      ) : (
        <Link href="/login">Login to Create</Link>
      )}
    </div>
  );
}
