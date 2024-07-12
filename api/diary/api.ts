import axios from "axios";
import { getCookie } from "@/util/tokenCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createDiary = async ({ date, createData, photos }: any) => {
  const access_token = getCookie("access_token");

  if (access_token) {
    const formData = new FormData();

    if (createData) {
      formData.append("data", JSON.stringify(createData));

      if (photos) {
        for (let i = 0; i < photos.length; i++) {
          formData.append("photos", photos[i]);
        }
      }
    }
    const { data } = await axios.post(
      `${API_URL}/diaries?date=${date}`,
      formData,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

export const getDiariesForMonth = async (month: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.get(
      `${API_URL}/diaries?date=${month.slice(0, 7)}`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    return data;
  }
  return [];
};

export const getDiaryForDay = async ({ date }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.get(`${API_URL}/diaries?date=${date}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  } else {
    return null;
  }
};

export const updateDiary = async ({ updateData, photos, diaryId }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const formData = new FormData();

    formData.append("data", JSON.stringify(updateData));
    if (photos) {
      for (let i = 0; i < photos.length; i++) {
        formData.append("photos", photos[i]);
      }
    }

    const { data } = await axios.put(
      `${API_URL}/diaries/${diaryId}`,
      formData,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

export const updateDiaryRemember = async ({ diaryId, remember }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const formData = new FormData();
    formData.append("data", JSON.stringify({}));

    const { data } = await axios.put(
      `${API_URL}/diaries/${diaryId}?remember=${remember}`,
      formData,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );

    return data;
  }
};

export const deleteDiary = async (diaryId: string) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.delete(`${API_URL}/diaries/${diaryId}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  } else {
    return [];
  }
};

// For Month: remembers in diaries
export const getRemembersForMonth = async (date: any) => {
  const access_token = getCookie("access_token");

  if (access_token) {
    const headers = { Authorization: `Bearer ${access_token}` };
    const { data } = await axios.get(
      `${API_URL}/diaries?date=${date}&remember=true`,
      { headers },
    );

    return data;
  } else {
    return [];
  }
};

export const getSearchDiaries = async ({
  search,
  date,
}: {
  search: string;
  date: any;
}) => {
  const access_token = getCookie("access_token");
  const headers = { Authorization: `Bearer ${access_token}` };
  if (access_token) {
    const response = await axios.get(
      `${API_URL}/search-diaries?searchTerm=${search}&date=${date}`,
      { headers },
    );
    return response.data;
  }
};
