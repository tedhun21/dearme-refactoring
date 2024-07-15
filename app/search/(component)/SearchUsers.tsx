import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";

import { getSearchUsers } from "@/api/user/api";
import UserWithNoImage from "@/public/social/UserWithNoImage";

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

export default function SearchUsers({ search, handleAddRecent }: any) {
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  // 유저 검색
  const { isPending: isSearchUserPending, data: searchUsersData } = useQuery({
    queryKey: ["getSearchUsers"],
    queryFn: () => getSearchUsers(search),
    enabled: debouncedSearch.length !== "",
  });

  // debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-default-500">Users</span>
      <div>
        {Array.isArray(searchUsersData) && searchUsersData.length > 0 ? (
          searchUsersData.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              onClick={() => {
                handleAddRecent(user.nickname, user.photo, user.id);
              }}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-default-200 active:bg-default-300"
            >
              <div className="relative size-10 overflow-hidden rounded-full">
                {user.photo ? (
                  <Image
                    src={`${BUCKET_URL}${user.photo}`}
                    alt="User image"
                    className="object-cover"
                    fill
                  />
                ) : (
                  <UserWithNoImage className="h-full w-full" />
                )}
              </div>
              <span className="text-sm font-medium">{user.nickname}</span>
            </Link>
          ))
        ) : (
          <div className="flex w-full justify-center p-4 text-xs font-normal text-default-300">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
