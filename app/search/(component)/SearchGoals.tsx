import { useEffect, useState } from "react";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { HashtagIcon } from "@heroicons/react/24/outline";

import { getSearchGoals } from "@/api/goal/api";

export default function SearchGoals({ search, handleAddRecent }: any) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data: searchGoalData } = useQuery({
    queryKey: ["getSearchGoals", debouncedSearch],
    queryFn: () => getSearchGoals(debouncedSearch.substring(1)),
    enabled:
      debouncedSearch.startsWith("#") && debouncedSearch.substring(1) !== "",
  });

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-default-500">Goals</span>
      <div>
        {Array.isArray(searchGoalData) && searchGoalData.length > 0 ? (
          searchGoalData.map((goal: any) => (
            <Link
              key={goal.id}
              href={`/search/${goal.title}`}
              onClick={() => {
                handleAddRecent(`#${goal.title}`, "");
              }}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-default-200 active:bg-default-300"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white p-1">
                  <HashtagIcon className="size-5 stroke-2 text-default-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{goal.title}</span>
                  <span className="text-xs font-medium">
                    {goal.postsCount?.toLocaleString() +
                      (goal.postsCount <= 1 ? " post" : " posts")}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="mb-5 flex w-full justify-center  text-xs font-normal text-default-300">
            No goals found
          </div>
        )}
      </div>
    </div>
  );
}
