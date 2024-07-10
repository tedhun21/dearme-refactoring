import { convertYearMonth } from "@/util/date";
import { TicketIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function MonthlyDiaryLink({ date }: any) {
  const yearMonth = convertYearMonth(date);
  return (
    <div className="fixed bottom-36 w-full max-w-[600px]">
      <div className="absolute right-4 rounded-full bg-default-300 p-3 shadow-lg hover:bg-default-400 active:bg-default-900">
        <Link href={`/diary/${yearMonth}`}>
          <TicketIcon className="size-10" />
        </Link>
      </div>
    </div>
  );
}
