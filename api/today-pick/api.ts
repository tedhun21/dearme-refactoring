import axios from "axios";
import { getCookie } from "@/util/tokenCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createTodayPick = async ({ createData, image, diaryId }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    if (createData && diaryId) {
      const formData = new FormData();

      formData.append("data", JSON.stringify({ ...createData, diaryId }));
      if (image) {
        formData.append("image", image);
      }
      const { data } = await axios.post(`${API_URL}/today-picks`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      return data;
    }
  }
};

// today-pick 삭제
export const deleteTodayPick = async (id: number) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.delete(`${API_URL}/today-picks/${id}`);
    return data;
  }
};
