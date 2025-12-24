import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./apiClient";
import { toast } from "sonner";

// GET(READ) USER NOTIFICATIONS
export const useGetUserNotifications = (
  pageNumber: number = 1,
  limit: number
) => {
  return useQuery({
    queryKey: ["notifications", pageNumber],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/api/notifications/user-notifications",
        {
          params: { pageNumber, limit },
        }
      );
      return response.data;
    },
  });
};

// UPDATE USER NOTIFICATIONS
export const useUpdateNotificationRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      notificationId,
      payload,
    }: {
      notificationId: string;
      payload: any;
    }) => {
      const response = await axiosInstance.put(
        `/api/notifications/${notificationId}`,
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Notification updated successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

// DELETE USER NOTIFICATION  REQUEST
export const useDeleteNotificationRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ notificationId }: { notificationId: string }) => {
      const response = await axiosInstance.delete(
        `/api/notifications/${notificationId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Notification deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};
