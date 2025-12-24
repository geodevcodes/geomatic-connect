import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// CREATE NEW USER REQUEST (REGISTER USER)
export const useRegisterRequest = () => {
  return useMutation({
    mutationFn: async ({ payload }: { payload: any }) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/auth/register`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Register successfully 🎉");
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

export const RegisterRequest = async (body: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASEURL}/auth/register`,
      body,
      {
        headers: {
          Accept: "application/vnd.connect.v1+json",
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const data = response.data;
    console.log(data, "data is here");
    if (!data) return;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// EMAIL VERIFICATION REQUEST
export const useVerifyEmailRequest = () => {
  return useMutation({
    mutationFn: async ({ payload }: { payload: any }) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/auth/verify-email`,
          payload,
          {
            headers: {
              Accept: "application/vnd.connect.v1+json",
              "Content-Type": "application/json",
            },
          }
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
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/auth/resend-verification`,
          payload,
          {
            headers: {
              Accept: "application/vnd.connect.v1+json",
              "Content-Type": "application/json",
            },
          }
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
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/auth/forgot-password`,
          payload,
          {
            headers: {
              Accept: "application/vnd.connect.v1+json",
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Forgot password initiated successfully 🎉");
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
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/auth/reset-password/${token}`,
          payload,
          {
            headers: {
              Accept: "application/vnd.connect.v1+json",
              "Content-Type": "application/json",
            },
          }
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
