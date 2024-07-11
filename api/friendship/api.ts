import axios from "axios";
import { getCookie } from "@/util/tokenCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getMyFriendsWithPage = async ({ pageParam, size }: any) => {
  const access_token = getCookie("access_token");

  if (access_token) {
    const {
      data: { results, pagination },
    } = await axios.get(
      `${API_URL}/friendships/friend?page=${pageParam}&size=${size}`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return results;
  }
};

export const getMyRequestsWithPage = async ({ pageParam }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const {
      data: { users, pagination },
    } = await axios.get(
      `${API_URL}/friendships/request?page=${pageParam}&size=5`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return users;
  }
};

export const getMyFriendsAndBlock = async ({
  pageParam,
  searchParam,
  size,
}: any) => {
  const access_token = getCookie("access_token");

  if (access_token) {
    let q = "";
    if (searchParam) {
      q = `&q=${searchParam}`;
    }

    const {
      data: { results },
    } = await axios.get(
      `${API_URL}/friendships/friendandblock?page=${pageParam}&size=${size}${q}`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return results;
  }
};

// 유저와 나와의 관계 확인
export const findFriendship = async (userId: string) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.get(
      `${API_URL}/friendships?friendId=${userId}`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

//  팔로우 요청
export const followUser = async (userId: number) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.post(
      `${API_URL}/friendships?friendId=${userId}`,
      {},
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

// 팔로우 취소
export const followCancelFriedship = async (userId: number) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.put(
      `${API_URL}/friendships?friendId=${userId}&status=requestCancel`,
      {},
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

// 팔로우 요청 수락 (pending -> accept)
export const acceptRequest = async (userId: number) => {
  const access_token = getCookie("access_token");

  if (access_token) {
    const { data } = await axios.put(
      `${API_URL}/friendships?friendId=${userId}&status=friend`,
      {},
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

// 친구 블락
export const blockFriend = async (friendId: number) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.put(
      `${API_URL}/friendships?friendId=${friendId}&status=block`,
      {},
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

// 블락 풀기
export const unblockFriend = async (friendId: number) => {
  const access_token = getCookie("access_token");

  if (access_token) {
    const { data } = await axios.put(
      `${API_URL}/friendships?friendId=${friendId}&status=unblock`,
      {},
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

export const getLikeship = async ({
  postId,
  all,
}: {
  postId: number;
  all: boolean;
}) => {
  let url = `${API_URL}/posts/${postId}/likeship`;
  if (all) {
    url += "?all=true";
    const response = await axios.get(url);
    return response.data.results;
  } else {
    const access_token = getCookie("access_token");
    const headers = { Authorization: `Bearer ${access_token}` };
    const response = await axios.get(url, { headers });
    return response.data.results;
  }
};

// Update _ friendship
export const updateFriendship = async ({
  friendId,
  status,
}: {
  friendId: number;
  status: null | string;
}) => {
  const access_token = getCookie("access_token");
  const headers = { Authorization: `Bearer ${access_token}` };
  if (access_token) {
    const response = await axios.put(
      `${API_URL}/friendships?friendId=${friendId}&status=${status}`,
      null,
      { headers },
    );
  }
};
