"use client";

import { useQuery } from "@tanstack/react-query";

import GoalList from "../GoalList";
import { getToday } from "@/util/date";
import { getMyGoals } from "@/api/goal/api";

export default function MeGoal({ route }: any) {
  const { data: goalData } = useQuery({
    queryKey: ["getMyGoals"],
    queryFn: () => getMyGoals({ date: getToday() }),
  });

  return (
    <section className={`${route === "/" ? "" : "px-4"}`}>
      {route !== "/" ? (
        <div className="font-semibold text-default-700">Goal</div>
      ) : null}
      <div
        className={`flex flex-col gap-3 bg-default-100 px-4 py-3 ${
          route === "/" ? "rounded-b-xl" : "rounded-xl"
        }`}
      >
        {Array.isArray(goalData) && goalData.length !== 0 ? (
          goalData.map((goal: any) => (
            <GoalList key={goal.id} route="home" goal={goal} />
          ))
        ) : (
          <div className="p-4 text-center font-bold">No Goal</div>
        )}
      </div>
    </section>
  );
}
