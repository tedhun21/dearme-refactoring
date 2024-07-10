import axios from "axios";
import { getCookie } from "@/util/tokenCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getMyGoals = async ({ date }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.get(`${API_URL}/goals?date=${date}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  } else {
    return [];
  }
};
export const getGoals = async (date: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.get(`${API_URL}/goals?date=${date}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return data;
  }
};

export const getUserGoalsWithDate = async ({ userId, date }: any) => {
  const { data } = await axios.get(
    `${API_URL}/goals?userId=${userId}&date=${date}`,
  );
  return data;
};

export const createMyGoal = async (createData: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.post(`${API_URL}/goals`, createData, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  } else {
    return {};
  }
};

export const updateMyGoal = async ({ updateData, goalId }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.put(`${API_URL}/goals/${goalId}`, updateData, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  }
};

export const deleteMyGoal = async ({ deleteId }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.delete(`${API_URL}/goals/${deleteId}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  }
};

// Search _ goals
export const getSearchGoals = async (goal: string) => {
  const response = await axios.get(
    `${API_URL}/goals/search-goals?searchTerm=${goal}`,
  );

  return response.data;
};
