import axios from "axios";
import { getCookie } from "@/util/tokenCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/// 로그인
export const signIn = async ({ email, password }: any) => {
  const { data } = await axios.post(`${API_URL}/auth/local`, {
    identifier: email,
    password,
  });

  return data;
};

/// 내 정보 가져오기
export const getMe = async () => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const { data } = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return data;
  } else {
    return null;
  }
};

/// 내 정보 수정하기 (사진 제외)
export const updateMe = async ({ userId, updateData }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(updateData));

    const data = await axios.put(`${API_URL}/users/${userId}`, formData, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return data;
  }
};

/// 유저 정보 가져오기
export const getUser = async ({ userId }: any) => {
  if (userId) {
    const { data } = await axios.get(`${API_URL}/users/${userId}`);

    return data;
  }
};

/// 유저 사진만 수정
export const updateUserPhoto = async ({
  userId,
  selectedFile,
}: {
  userId: number;
  selectedFile: File;
}) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const formData = new FormData();
    formData.append("data", JSON.stringify({}));
    formData.append("photo", selectedFile);
    const { data } = await axios.put(`${API_URL}/users/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return data;
  }
};

/// 유저 백그라운드 사진만 수정
export const updateBackGroundPhoto = async ({
  userId,
  selectedFile,
}: {
  userId: number;
  selectedFile: File;
}) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const formData = new FormData();
    formData.append("data", JSON.stringify({}));
    formData.append("background", selectedFile);

    const data = await axios.put(`${API_URL}/users/${userId}`, formData, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return data;
  }
};

/// 유저 삭제하기
export const deleteMe = async ({ userId }: any) => {
  const access_token = getCookie("access_token");
  if (access_token) {
    const data = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return data;
  }
};

/// email 중복체크
export const checkEmail = async (checkData: any) => {
  const { data } = await axios.get(`${API_URL}/check-email?email=${checkData}`);
  return data;
};

/// nickname 중복체크
export const checkNickname = async (checkData: any) => {
  const { data } = await axios.get(
    `${API_URL}/check-nickname?nickname=${checkData}`,
  );
  return data;
};

/// create user
export const createUser = async (createData: any) => {
  const { data } = await axios.post(
    `${API_URL}/auth/local/register`,
    createData,
  );

  return data;
};

// Search _ users
export const getSearchUsers = async (name: string) => {
  const response = await axios.get(
    `${API_URL}/search-users?searchTerm=${name}`,
  );
  return response.data;
};
