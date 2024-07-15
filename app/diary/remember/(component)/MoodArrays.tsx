import { useEffect } from "react";

import { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";

import { getRemembersForMonth } from "@/api/diary/api";
import MoodArray from "./MoodArray";
import Loading from "@/public/common/Loading";

interface MoodCardsProps {
  selectedMonth: Dayjs | null;
}

export default function MoodArrays({ selectedMonth }: MoodCardsProps) {
  // get _ remembers
  const {
    isPending: isRememberPending,
    data: rememberData,
    refetch: refecthRemeberDiary,
  } = useQuery({
    queryKey: ["getRemebersForMonth"],
    queryFn: () => getRemembersForMonth(selectedMonth?.format("YYYY-MM")),
  });

  useEffect(() => {
    refecthRemeberDiary();
  }, [selectedMonth]);

  const moods =
    Array.isArray(rememberData) &&
    rememberData
      .map((remember) => remember.mood)
      .filter((mood, index, self) => self.indexOf(mood) === index);

  return (
    <section className="flex flex-col gap-5">
      {!isRememberPending &&
      Array.isArray(rememberData) &&
      Array.isArray(moods) &&
      moods.length > 0 ? (
        moods.map((mood: any, index: number) => (
          <MoodArray key={index} mood={mood} remembers={rememberData} />
        ))
      ) : rememberData?.length === 0 ? (
        <div className="m-5 flex justify-center text-sm text-default-500 ">
          No remembered moments yet
        </div>
      ) : isRememberPending ? (
        <div className="text-center">
          <Loading />
        </div>
      ) : null}
    </section>
  );
}
