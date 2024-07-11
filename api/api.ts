import axios from "axios";
import { getCookie } from "@/util/tokenCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 이미지 삭제
export const deleteImage = async (id: number) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.delete(`${API_URL}/upload/files/${id}`);
    return data;
  }
};
