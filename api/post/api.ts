import axios from "axios";
import { getCookie } from "@/util/tokenCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getMyPostsWithPage = async ({ pageParam }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const {
      data: { results },
    } = await axios.get(
      `${API_URL}/posts?friend=false&page=${pageParam}&size=20`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return { results };
  }
};

export const getPostWithPage = async ({ tab, pageParam }: any) => {
  let url = `${API_URL}/posts?page=${pageParam}&size=6`;
  if (tab === "all") {
    url += "&isPrivate=false";
    const response = await axios.get(url);
    return response.data.results;
  } else if (tab === "friends") {
    url += "&friend=true";
    const access_token = getCookie("access_token");
    if (!access_token) return;
    const headers = { Authorization: `Bearer ${access_token}` };
    const response = await axios.get(url, { headers });
    return response.data.results;
  }
};

export const getPost = async (postId: number) => {
  const response = await axios.get(`${API_URL}/posts/${postId}`);
  return response.data.results;
};

export const createPost = async ({
  createData,
  imageFile,
}: any): Promise<any> => {
  const access_token = getCookie("access_token");
  const headers = { Authorization: `Bearer ${access_token}` };
  if (access_token && createData) {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        goalId: createData.goalId,
        body: createData.postText,
        isPrivate: createData.isPrivate,
        commentSettings: createData.commetSettings,
      }),
    );
    formData.append("file", imageFile);

    const { data } = await axios.post(`${API_URL}/posts`, formData, {
      headers,
    });
    return data;
  }
};

// Update _ post
export const updatePost = async ({
  postId,
  selectedGoal,
  isPrivate,
  postText,
  selectedOption,
}: {
  postId: number;
  selectedGoal: any;
  isPrivate: boolean;
  postText: string;
  selectedOption: string;
}): Promise<any> => {
  const access_token = getCookie("access_token");
  const headers = { Authorization: `Bearer ${access_token}` };

  const formData = new FormData();

  formData.append(
    "data",
    JSON.stringify({
      goal: selectedGoal,
      body: postText,
      isPublic: !isPrivate,
      commentSettings: selectedOption,
    }),
  );

  try {
    const response = await axios.put(`${API_URL}/posts/${postId}`, formData, {
      headers,
    });
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// Delete _ post
export const deletePost = async (postId: number) => {
  const access_token = getCookie("access_token");
  const headers = { Authorization: `Bearer ${access_token}` };

  try {
    const response = await axios.delete(`${API_URL}/posts/${postId}`, {
      headers,
    });
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

// Put _ like
export const likePost = async (postId: number) => {
  const access_token = getCookie("access_token");
  const headers = { Authorization: `Bearer ${access_token}` };
  try {
    await axios.put(`${API_URL}/posts/${postId}/like`, {}, { headers });
  } catch (e) {
    console.error(e);
  }
};

// Search _ goals -> 검색된 포스트
export const getPostsByGoals = async (goal: any) => {
  const response = await axios.get(
    `${API_URL}/posts/findOnGoal?searchTerm=${goal}`,
  );
  return response.data;
};

export const getTagCountsByDiary = async ({ date, tag, page, size }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const headers = { Authorization: `Bearer ${access_token}` };
    const { data } = await axios.get(
      `${API_URL}/diaries/tags?tag=${tag}&date=${date}&page=${page}&size=${size}`,
      {
        headers,
      },
    );

    return data;
  }
};
