import axios from "axios";
import { getCookie } from "@/util/tokenCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getMyTodosWithDate = async ({ date }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.get(`${API_URL}/todos?date=${date}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return data;
  } else {
    return [];
  }
};

export const getUserTodosWithDate = async ({ userId, date }: any) => {
  const { data } = await axios.get(
    `${API_URL}/todos?userId=${userId}&date=${date}`,
  );

  return data;
};

export const createMyTodo = async ({ createData }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.post(`${API_URL}/todos`, createData, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  }
};

export const updateMyTodo = async ({ todoId, updateData }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.put(`${API_URL}/todos/${todoId}`, updateData, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  }
};

/// todo 우선순위 업데이트
export const updateMyTodoPriority = async ({
  date,
  source,
  destination,
}: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.put(
      `${API_URL}/todos/${date}/updatePriority`,
      { data: { source, destination } },
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

export const updateMyTodoDone = async ({ todoId, done }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.put(
      `${API_URL}/todos/${todoId}`,
      { done },
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

export const deleteMyTodo = async ({ todoId }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const data = await axios.delete(`${API_URL}/todos/${todoId}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  }
};
