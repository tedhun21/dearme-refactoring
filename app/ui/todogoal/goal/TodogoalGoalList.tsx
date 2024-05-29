import { goalListState } from "@/store/atoms";
import { useRecoilValue } from "recoil";
import GoalList from "../../me/GoalList";

export default function TodogoalGoalList({ date }: any) {
  const goals = useRecoilValue(goalListState);
  return (
    <div className="rounded-3xl bg-default-200 p-4 text-black">
      {Array.isArray(goals) &&
        goals.length > 0 &&
        goals.map((goal) => (
          <GoalList key={goal.id} date={date} route="todogoal" goal={goal} />
        ))}
    </div>
  );
}
