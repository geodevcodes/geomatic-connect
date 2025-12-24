import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./apiClient";
import { toast } from "sonner";

// CREATE A JOB REQUEST
export const useCreateJobRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post("/api/jobs", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

// GET(READ) ALL JOBS
export const useGetJobsRequest = (pageNumber: number = 1, limit: number) => {
  return useQuery({
    queryKey: ["jobs", pageNumber],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/jobs", {
        params: { pageNumber, limit },
      });
      return response.data;
    },
  });
};

// GET(READ) COMPANY JOBS
export const useGetCompanyJobsRequest = (
  pageNumber: number = 1,
  limit: number
) => {
  return useQuery({
    queryKey: ["jobs", pageNumber],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/jobs/company-jobs", {
        params: { pageNumber, limit },
      });
      return response.data;
    },
  });
};

// GET(READ) A JOB
export const useGetJobRequest = (jobId: string) => {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/jobs/${jobId}`);
      return response.data;
    },
    enabled: !!jobId,
  });
};

// UPDATE A JOB REQUEST
export const useUpdateJobRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, payload }: { jobId: string; payload: any }) => {
      const response = await axiosInstance.put(`/api/jobs/${jobId}`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Job updated successfully");
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

// APPLY TO A JOB REQUEST
export const useApplyToJobRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId }: { jobId: string }) => {
      const response = await axiosInstance.post(`/api/jobs/${jobId}/apply`, {});
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

// DELETE A JOB  REQUEST
export const useDeleteJobRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId }: { jobId: string }) => {
      const response = await axiosInstance.delete(`/api/jobs/${jobId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Job deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};
