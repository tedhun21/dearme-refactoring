import { useState } from "react";
import { TagIcon } from "@heroicons/react/24/outline";

export default function TagSection({
  feelingsTags,
}: {
  feelingsTags: string[];
}) {
  const [showAllTags, setShowAllTags] = useState(false);

  const handleShowMoreTags = () => {
    setShowAllTags(true);
  };

  return (
    <section className="flex items-center gap-4 border-y-2 border-default-300 bg-default-200 p-4">
      <TagIcon className="size-8 stroke-2" />
      <div className="flex flex-wrap gap-3">
        {/* 첫 3개의 태그 또는 모든 태그를 렌더링 */}
        {feelingsTags
          ?.slice(0, showAllTags ? feelingsTags.length : 3)
          .map((tag, index) => (
            <span
              key={index}
              className="rounded-lg border-2 border-default-400 bg-default-300 px-2 py-1 text-sm font-semibold text-default-800 xs:text-base"
            >
              {tag}
            </span>
          ))}
        {/* 태그가 3개 이상일 때만 더 보기 버튼을 줌 */}
        {!showAllTags && feelingsTags?.length > 3 && (
          <button
            onClick={handleShowMoreTags}
            className="rounded-lg border-2 border-default-400 bg-default-300 px-2 py-1 text-sm font-semibold text-default-800 hover:text-default-900 xs:text-base"
          >
            + {feelingsTags.length - 3}
          </button>
        )}
      </div>
    </section>
  );
}
