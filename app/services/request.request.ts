import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./apiClient";
import { toast } from "sonner";

// GET(READ) REQUEST
export const useGetAllNotifications = (
  pageNumber: number = 1,
  limit: number
) => {
  return useQuery({
    queryKey: ["getNotificationsApi", pageNumber],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/requests", {
        params: { pageNumber, limit },
      });
      return response.data;
    },
  });
};

// GET(READ) ALL COMPANIES REQUEST
export const useGetCompaniesRequest = (state: string, search: string) => {
  return useQuery({
    queryKey: ["getCompaniesApi", state, search],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/users/companies", {
        params: { state, search },
      });
      return response.data;
    },
  });
};

// GET(READ) ALL STUDENTS REQUEST
export const useGetStudentsRequest = () => {
  return useQuery({
    queryKey: ["studentsApi"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/users/students");
      return response.data;
    },
    enabled: true,
  });
};

// GET USER BY ID REQUEST
export const useGetUserByIdRequest = (userId: string) => {
  return useQuery({
    queryKey: ["getUserByIdApi", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

//MAKE A REQUEST (Send request to Admin)
export const useStudentSendRequestToAdmin = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post(
        "/api/requests/send-to-admin",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

//FORWARD A REQUEST (Forward request to Company)
export const useAdminSendRequestToCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post(
        "/api/requests/send-to-company",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["getNotificationsApi"],
      });
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

//APPROVED REQUEST BY COMPANY (Company approved a student request)
export const useCompanyApproveStudentRequest = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post(
        "/api/requests/company-interest/approve",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
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

//APPROVED REQUEST BY ADMIN (Admin approved a student request)
export const useAdminApproveStudentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post(
        "/api/requests/admin/approve",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["getNotificationsApi"],
      });
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

//DECLINED REQUEST BY COMPANY (Company declined a student request)
export const useCompanyDeclineStudentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post(
        "/api/requests/company-interest/decline",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["getNotificationsApi"],
      });
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

//DECLINED REQUEST BY ADMIN (Admin declined a student request)
export const useAdminDeclineStudentRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post(
        "/api/requests/admin/decline",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["getNotificationsApi"],
      });
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

// GET STUDENTS BY COMPANY ID REQUEST
export const useGetStudentsByCompanyRequest = (
  companyId: string,
  state: string,
  search: string
) => {
  return useQuery({
    queryKey: ["getStudentsApi", state, search],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/api/requests/company/${companyId}`,
        {
          params: { state, search },
        }
      );
      return response.data;
    },
    enabled: !!companyId,
  });
};

// GET COMPANIES BY STUDENT ID REQUEST
export const useGetCompaniesByStudentRequest = (studentId: string) => {
  return useQuery({
    queryKey: ["getUserByIdApi", studentId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/api/requests/student/${studentId}`
      );
      return response.data;
    },
    enabled: !!studentId,
  });
};
