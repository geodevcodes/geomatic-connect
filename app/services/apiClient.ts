import { getSession } from "next-auth/react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------------------------------------
   REQUEST INTERCEPTOR
   - Attaches Bearer token from NextAuth
   - Token is always valid because auth() refreshes if expired
--------------------------------------------- */
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession(); // ✅ always returns a valid session
      const token = session?.user?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (err) {
      console.error("Failed to get session in request interceptor:", err);
      return config; // still allow request even if session fails
    }
  },
  (error) => Promise.reject(error)
);

/* ---------------------------------------------
   RESPONSE INTERCEPTOR
   - Optional: just forward errors
   - No refresh logic here; handled in auth.ts
--------------------------------------------- */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
