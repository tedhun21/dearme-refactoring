import axios from "axios";
import { getCookie } from "@/util/tokenCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createComment = async ({
  postId,
  comment,
}: {
  postId: number;
  comment: string;
}) => {
  const access_token = getCookie("access_token");

  if (access_token) {
    const headers = { Authorization: `Bearer ${access_token}` };
    const { data } = await axios.post(
      `${API_URL}/comments?postId=${postId}`,
      { body: comment },
      { headers },
    );

    return data;
  }
};

// Read _ comment
export const getCommentsWithPage = async ({ postId, pageParam }: any) => {
  const { data } = await axios.get(
    `${API_URL}/comments?page=${pageParam}&size=10&postId=${postId}`,
  );

  return data.results;
};

// Update _ comment
export const updateComment = async ({
  postId,
  commentId,
  comment,
}: {
  postId: number;
  commentId: number | null;
  comment: string;
}) => {
  const access_token = getCookie("access_token");
  const headers = { Authorization: `Bearer ${access_token}` };

  if (access_token) {
    await axios.put(
      `${API_URL}/comments/${commentId}?postId=${postId}`,
      { body: comment },
      { headers },
    );
  }
};

// Delete _ comment
export const deleteComment = async ({
  postId,
  commentId,
}: {
  postId: number;
  commentId: number;
}) => {
  const access_token = getCookie("access_token");
  const headers = { Authorization: `Bearer ${access_token}` };
  if (access_token) {
    await axios.delete(`${API_URL}/comments/${commentId}?postId=${postId}`, {
      headers,
    });
  }
};
