import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./apiClient";

// GET(READ) ALL ANALYTICS REQUEST
export const useGetStudentAnalyticsRequest = () => {
  return useQuery({
    queryKey: ["getStudentAnalyticsApi"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/analytics/student");
      return response.data;
    },
    enabled: true,
  });
};
