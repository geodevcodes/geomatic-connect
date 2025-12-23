import { getSession } from "next-auth/react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.user?.token) {
      config.headers.Authorization = `Bearer ${session.user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (auto-refresh)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const session = await getSession();

      if (!session?.user?.refreshToken) {
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/auth/refresh`,
          {
            refreshToken: session.user.refreshToken,
          }
        );

        const newAccessToken = res.data.accessToken;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
