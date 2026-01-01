import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./apiClient";
import { toast } from "sonner";

// GET(READ) ALL USERS REQUEST
export const useGetUsersRequest = (
  pageNumber: number = 1,
  limit: number,
  search: string
) => {
  return useQuery({
    queryKey: ["getUsersApi", pageNumber],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/users", {
        params: { pageNumber, limit, search },
      });
      return response.data;
    },
  });
};

// GET USER PROFILE REQUEST
export const useGetUserProfileRequest = (userId: string) => {
  return useQuery({
    queryKey: ["getUserProfileApi", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/users/profile/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

// UPDATE USER PROFILE
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      formData,
    }: {
      userId: string;
      formData: FormData;
    }) => {
      const response = await axiosInstance.put(
        `/api/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // let Axios handle the boundary
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully 🎉");
      queryClient.invalidateQueries({ queryKey: ["getAllUserDetailsApi"] });
      queryClient.invalidateQueries({ queryKey: ["getUserProfileApi"] });
      queryClient.invalidateQueries({ queryKey: ["getUsersApi"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

// DELETE USER REQUEST
export const useDeleteUserRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const response = await axiosInstance.delete(`/api/users/${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};
