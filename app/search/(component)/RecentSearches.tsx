import RecentSearch from "./RecentSearch";

interface RecentSearchesProps {
  recentSearches: {
    id: number;
    text: string;
    photo?: string;
    userId?: number;
  }[];
  onRecentRemove: (id: number) => void;
  onClearRecent: () => void;
}

export default function RecentSearches({
  recentSearches,
  onRecentRemove,
  onClearRecent,
}: RecentSearchesProps) {
  return (
    <section className="mt-5 flex w-full flex-col gap-3 rounded-lg border-default-400 bg-default-100 p-3">
      {/* Recent & Clear All */}
      <div className="flex w-full justify-between">
        <span className="text-base font-medium">Recent</span>
        {recentSearches.length > 0 ? (
          <button
            className="border-none text-sm font-medium text-default-400 hover:text-default-500"
            onClick={onClearRecent}
          >
            Clear All
          </button>
        ) : null}
      </div>

      {/* Recents */}
      {recentSearches.length === 0 ? (
        <div className="flex w-full justify-center p-4 text-base font-medium text-default-400">
          No recent searches
        </div>
      ) : recentSearches.length > 0 ? (
        <div className="flex flex-col gap-1">
          {recentSearches.map((recent) => (
            <RecentSearch
              key={recent.id}
              recent={recent}
              onRecentRemove={onRecentRemove}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
