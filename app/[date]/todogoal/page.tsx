"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";

import dayjs from "dayjs";

import {
  ISetting,
  goalListState,
  settingState,
  todoListState,
} from "@/store/atoms";

import Footer from "@/app/ui/footer/Footer";

import TodogoalHeader from "@/app/[date]/todogoal/(component)/TodogoalHeader";
import TodogoalDragTodo from "@/app/[date]/todogoal/(component)/todo/TodogoalDragTodo";
import TodogoalGoalList from "@/app/[date]/todogoal/(component)/goal/TodogoalGoalList";
import TodogoalPropgress from "@/app/[date]/todogoal/(component)/todo/TodoProgress";

import CalendarSelect from "@/app/[date]/todogoal/(component)/todo/CalendarSelect";
import CreateTodoGoal from "@/app/[date]/todogoal/(component)/CreateTodoGoal";
import GoalProgress from "./(component)/goal/GoalProgress";
import { getMyTodosWithDate } from "@/api/todo/api";
import { getMyGoals } from "@/api/goal/api";
import { getMe } from "@/api/user/api";

export default function DailyTodoGoal() {
  const { data: meData } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

  // url에 적힌 date
  const { date } = useParams<{ date: string }>();

  // TODO || GOAL
  const [{ todogoalTitle, todogoalDate }, setSetting] =
    useRecoilState<ISetting>(settingState);

  const [todos, setTodos] = useRecoilState(todoListState);
  const [goals, setGoals] = useRecoilState(goalListState);

  const DdayGoal =
    goals && goals.length > 1
      ? goals?.filter((goal) => goal.endDate === date)
      : [];

  // get todos
  const {
    isSuccess: isTodoSuccess,
    data: todoData,
    refetch: refetchTodo,
    isRefetching: isTodoRefetching,
  } = useQuery({
    queryKey: ["getMyTodosWithDate"],
    queryFn: () =>
      getMyTodosWithDate({ date: dayjs(date).format("YYYY-MM-DD") }),
  });

  // get goals
  const {
    isSuccess: isGoalSuccess,
    data: goalData,
    refetch: refetchGoal,
    isRefetching: isGoalRefetching,
  } = useQuery({
    queryKey: ["getMyGoals"],
    queryFn: () => getMyGoals({ date: dayjs(date).format("YYYY-MM-DD") }),
  });

  // ABOUT: get todos
  useEffect(() => {
    if (isTodoSuccess || !isTodoRefetching) {
      setTodos(todoData);
    }
  }, [isTodoSuccess, isTodoRefetching]);

  useEffect(() => {
    if (!isTodoRefetching && todogoalDate && todogoalTitle === "Todo") {
      refetchTodo();
    }
    if (!isGoalRefetching && todogoalDate && todogoalTitle === "Goal") {
      refetchGoal();
    }
  }, [todogoalDate, todogoalTitle]);

  // ABOUT: get goals
  useEffect(() => {
    if (isGoalSuccess || !isGoalRefetching) {
      setGoals(goalData);
    }
  }, [isGoalSuccess, isGoalRefetching]);

  return (
    <main className="flex min-h-screen justify-center">
      <div className="flex w-full min-w-[360px] max-w-[600px] flex-col bg-default-200 pb-28 shadow-lg">
        <article className="flex flex-col gap-5 p-5">
          <TodogoalHeader me={meData} />
          <section className="flex flex-col gap-2">
            {/* 섹션 1: calendar */}
            <CalendarSelect date={date} todos={todos} goals={goals} />
            {/* 섹션 2: todo/goal progress */}
            {todogoalTitle === "Todo" ? (
              <TodogoalPropgress todos={todos} />
            ) : (
              DdayGoal?.length > 0 && <GoalProgress />
            )}
            {/* 섹션 3: togo/goal list */}
            {todogoalTitle === "Todo" &&
            Array.isArray(todos) &&
            todos.length > 0 ? (
              <TodogoalDragTodo date={date} />
            ) : (
              todogoalTitle === "Goal" &&
              Array.isArray(goals) &&
              goals.length > 0 && <TodogoalGoalList date={date} />
            )}
            {/* 섹션 4: create todo / goal */}
            <CreateTodoGoal me={meData} />
          </section>
        </article>
        <Footer />
      </div>
    </main>
  );
}
