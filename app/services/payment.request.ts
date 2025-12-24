import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "./apiClient";
import { toast } from "sonner";

// ACCEPT PAYMENT REQUEST
export const useAcceptPaymentRequest = () => {
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post("/api/acceptpayment", payload);
      return response.data;
    },
    onSuccess: () => {
      // toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
};

// VERIFY PAYMENT
export const VerifyPaymentRequest = async (
  reference: any,
  subscriptionPlan: any
) => {
  const response = await axiosInstance.get(
    `/api/verifypayment/${reference}?subscriptionPlan=${subscriptionPlan}`,
  );
  const data = await response.data;
  return data;
};
// export const useVerifyPaymentRequest = (
//   reference: any,
//   subscriptionPlan: any
// ) => {
//   return useQuery({
//     queryKey: ["verifyPayment", reference, subscriptionPlan],
//     queryFn: async () => {
//       const response = await axiosInstance.get(
//         `/api/verifypayment/${reference}?subscriptionPlan=${subscriptionPlan}`
//       );
//       return response.data;
//     },
//     enabled: !!reference && !!subscriptionPlan,
//   });
// };

// GET ALL SUBSCRIPTIONS
export const useGetAllSubscriptions = (
  pageNumber: number = 1,
  limit: number,
  search: string
) => {
  return useQuery({
    queryKey: ["subscription", pageNumber],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/subscription", {
        params: { pageNumber, limit, search },
      });
      return response.data;
    },
  });
};
