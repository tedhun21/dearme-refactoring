"use client";

import { useEffect, useState } from "react";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

import RecentSearches from "./RecentSearches";

import SearchUsers from "./SearchUsers";
import SearchGoals from "./SearchGoals";

interface recentSearch {
  id: number;
  text: string;
  userId?: number;
  photo?: string;
}

export default function SearchBar() {
  // input focus
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [search, setSearch] = useState<string>("");

  // 최근 검색어
  const [recentSearches, setRecentSearches] = useState<recentSearch[]>([]);

  const handleDelete = () => {
    setSearch("");
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };
  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const handleRemoveRecent = (id: number) => {
    const newRecent = recentSearches.filter((recent) => {
      return recent.id !== id;
    });
    setRecentSearches(newRecent);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const handleAddRecent = (text: string, photo: string, userId?: number) => {
    const existingIndex = recentSearches.findIndex(
      (recent) => recent.text === text,
    );
    let updatedRecentSearches;

    if (existingIndex !== -1) {
      const existingRecent = recentSearches[existingIndex];
      updatedRecentSearches = [
        { ...existingRecent, id: Date.now() },
        ...recentSearches.slice(0, existingIndex),
        ...recentSearches.slice(existingIndex + 1),
      ];
    } else {
      const newRecent = {
        id: Date.now(),
        text: text,
        ...(photo && { photo: photo }),
        userId: userId,
      };
      updatedRecentSearches = [newRecent, ...recentSearches.slice(0, 9)];
    }

    setRecentSearches(updatedRecentSearches);
  };

  // 처음 마운트 됐을때 브라우저 localStorage에서 초기값 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      const result = localStorage.getItem("recentSearches") || "[]";
      setRecentSearches(JSON.parse(result));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  return (
    <>
      {/* 검색 상자*/}
      <section className="flex w-full items-center gap-3">
        <div
          className={`flex h-12 w-full items-center border-2 bg-default-100 ${
            search !== "" ? "rounded-t-lg" : "rounded-lg"
          } ${
            isInputFocused
              ? "border-default-900"
              : "border-default-300 hover:border-default-400"
          }`}
        >
          <div className="p-3">
            <MagnifyingGlassIcon className="size-6" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="user, #goal and more..."
            className={`h-10 flex-grow bg-transparent text-sm focus:outline-none ${
              isInputFocused ? "text-default-800" : "text-default-500"
            }`}
          />

          {search && (
            <button onClick={handleDelete} className="p-3">
              <XMarkIcon className="size-5 stroke-2 text-default-600" />
            </button>
          )}
        </div>
      </section>

      {/* !input Focus ? 최근 검색어 : 추천 검색어 */}
      {search === "" ? (
        <RecentSearches
          recentSearches={recentSearches}
          onRecentRemove={(id) => handleRemoveRecent(id)}
          onClearRecent={handleClearRecent}
        />
      ) : (
        <section className="flex w-full flex-col rounded-b-lg border-x-2 border-b-2 border-default-300 bg-default-100 p-3">
          {/* 검색 결과 */}
          {/* #목표 검색 */}
          {search.trim() !== "" && search.startsWith("#") ? (
            <SearchGoals search={search} handleAddRecent={handleAddRecent} />
          ) : (
            //  유저 검색
            <SearchUsers search={search} handleAddRecent={handleAddRecent} />
          )}
        </section>
      )}
    </>
  );
}
