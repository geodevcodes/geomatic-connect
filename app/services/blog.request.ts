import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./apiClient";
import { toast } from "sonner";

// CREATE NEW BLOG REQUEST
export const useCreateBlogRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post("/api/blogs", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error: any) => {
      if (error.response?.status === 500) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response?.data?.message);
      }
    },
  });
};

// GET(READ) BLOGS
export const useGetBlogsRequest = (pageNumber: number = 1, limit: number) => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/blogs", {
        params: { pageNumber, limit },
      });
      return response.data;
    },
  });
};

// GET BLOG  REQUEST
export const useGetBlogRequest = (blogSlug: string) => {
  return useQuery({
    queryKey: ["blog", blogSlug],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/blogs/${blogSlug}`);
      return response.data;
    },
    enabled: !!blogSlug,
  });
};

// UPDATE BLOG
export const useUpdateBlogRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      blogId,
      payload,
    }: {
      blogId: string;
      payload: any;
    }) => {
      const response = await axiosInstance.put(`/api/blogs/${blogId}`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
    onError: (error: any) => {
      if (error.response?.status === 500) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response?.data?.message);
      }
    },
  });
};

// DELETE  BLOG  REQUEST
export const useDeleteBlogRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ blogId }: { blogId: string }) => {
      const response = await axiosInstance.delete(`/api/blogs/${blogId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
    onError: (error: any) => {
      if (error.response?.status === 500) {
        toast.error("Internal Server Error");
      } else {
        toast.error(error.response?.data?.message);
      }
    },
  });
};
