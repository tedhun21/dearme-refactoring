import { useEffect } from "react";
import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import { useRecoilState } from "recoil";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { getToday } from "@/util/date";
import { ISetting, settingState } from "@/store/atoms";

export default function CalendarSelect({ date, todos, goals }: any) {
  const router = useRouter();

  // TODO || GOAL
  const [{ todogoalTitle, todogoalDate }, setSetting] =
    useRecoilState<ISetting>(settingState);

  const handleTodayClick = () => {
    router.push(`/${getToday()}/todogoal`);
    setSetting((prev) => ({
      ...prev,
      todogoalDate: dayjs(getToday()),
    }));
  };

  useEffect(() => {
    setSetting((prev) => ({ ...prev, todogoalDate: dayjs(date) }));
  }, [date]);

  return (
    <div className="w-full rounded-3xl bg-default-800 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CalendarIcon className="size-5 text-default-200" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["day"]}
              value={todogoalDate}
              onChange={(newValue: any) => {
                setSetting((prev) => ({
                  ...prev,
                  todogoalDate: newValue,
                }));
                router.push(
                  `/${dayjs(newValue).format("YYYY-MM-DD")}/todogoal`,
                );
              }}
              minDate={dayjs(date).subtract(1, "month")}
              maxDate={dayjs(date).add(1, "month")}
              sx={{
                width: "100px",
                borderColor: "#ffffff",
                "& .MuiInputBase-root": {
                  color: "#ffffff",
                },
              }}
            />
          </LocalizationProvider>
        </div>
        <button
          onClick={handleTodayClick}
          className="rounded-2xl bg-default-300 px-3 py-1 font-semibold text-default-700 hover:bg-default-500 hover:text-black active:bg-default-900 active:text-white"
        >
          Today
        </button>
      </div>
      <div className="flex flex-col text-2xl font-bold *:text-white">
        <span>You have</span>
        {todogoalTitle === "Todo" ? (
          <span>
            {todos?.length} {todos?.length > 1 ? "tasks" : "task"} for {date}
          </span>
        ) : (
          <span>
            {goals?.length} {goals?.length > 1 ? "objectives" : "objective"} for{" "}
            {date}
          </span>
        )}
      </div>
      <div className="mb-3 mt-5 h-0.5 bg-white" />
      <div className="flex gap-5 text-default-300">
        <span>#planning</span>
        <span>#challenge</span>
        <span>#youthfulness</span>
      </div>
    </div>
  );
}
