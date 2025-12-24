import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./apiClient";
import { toast } from "sonner";

// CREATE NEW USER REQUEST (REGISTER USER)
export const useRegisterRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData }: { formData: any }) => {
      const response = await axiosInstance.post(`/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Register successfully 🎉");
      queryClient.invalidateQueries({ queryKey: ["getUsersApi"] });
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

// EMAIL VERIFICATION REQUEST
export const useVerifyEmailRequest = () => {
  return useMutation({
    mutationFn: async ({ payload }: { payload: any }) => {
      try {
        const response = await axiosInstance.post(
          `/auth/verify-email`,
          payload
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Email verify successfully 🎉");
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

// RESEND VERIFICATION REQUEST
export const useResendVerifyOTPRequest = () => {
  return useMutation({
    mutationFn: async ({ payload }: { payload: any }) => {
      try {
        const response = await axiosInstance.post(
          `/auth/resend-verification`,
          payload
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("OTP Reset successfully 🎉");
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

// FORGOT PASSWORD REQUEST
export const useForgotPasswordRequest = () => {
  return useMutation({
    mutationFn: async ({ payload }: { payload: any }) => {
      try {
        const response = await axiosInstance.post(
          `/auth/forgot-password`,
          payload
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Forgot password initiated successfully");
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

// RESET PASSWORD REQUEST
export const useResetPasswordRequest = () => {
  return useMutation({
    mutationFn: async ({ payload, token }: { payload: any; token: string }) => {
      try {
        const response = await axiosInstance.post(
          `/auth/reset-password/${token}`,
          payload
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Password Reset successfully 🎉");
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
