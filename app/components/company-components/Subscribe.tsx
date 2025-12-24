"use client";
import PackageInfo from "@/app/components/landing-page-components/PackageInfo";
import { useGetUserByIdRequest } from "@/app/services/request.request";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  useAcceptPaymentRequest,
  VerifyPaymentRequest,
} from "@/app/services/payment.request";
import { toast } from "sonner";

interface SubscribeProps {
  token: string;
  userId: string;
  setSelectedBillingCycleTab?: any;
  selectedBillingCycleTab?: any;
}

export default function Subscribe({ token, userId }: SubscribeProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBillingCycleTab, setSelectedBillingCycleTab] =
    useState("Monthly");
  const [isSubscribing, setIsSubscribing] = useState(null);
  const queryClient = useQueryClient();
  const { mutate: acceptPayment } = useAcceptPaymentRequest();

  const handleButtonClick = (planMethod: any) => {
    setIsSubscribing(planMethod);
  };
  const { data: userData } = useGetUserByIdRequest(userId);

  const monthlyPlans = [
    {
      planMethod: "Starter Monthly",
      amount: 1500,
      color: "#12B76A",
      paymentPlanId: 129893,
    },
    {
      planMethod: "Professional Monthly",
      amount: 1999,
      color: "#F59E0B",
      popular: true,
      paymentPlanId: 129903,
    },
    {
      planMethod: "Enterprise Monthly",
      amount: 2999,
      color: "#AA0BF5",
      paymentPlanId: 129902,
    },
  ];

  const yearlyPlans = [
    {
      planMethod: "Starter Yearly",
      amount: 17000,
      color: "#12B76A",
      paymentPlanId: 129899,
    },
    {
      planMethod: "Professional Yearly",
      amount: 22000,
      color: "#F59E0B",
      popular: true,
      paymentPlanId: 129900,
    },
    {
      planMethod: "Enterprise Yearly",
      amount: 33000,
      color: "#AA0BF5",
      paymentPlanId: 129901,
    },
  ];

  const plans =
    selectedBillingCycleTab === "Monthly" ? monthlyPlans : yearlyPlans;
  const billingCycle = selectedBillingCycleTab;

  // Payment Handler Logic
  const handleAcceptPayment = (amount: number, planMethod: string) => {
    if (!userData?.data?.email) return;

    setIsProcessing(true);
    const payload = {
      email: userData.data.email,
      amount,
      metadata: { subscriptionPlan: planMethod },
    };

    acceptPayment(payload, {
      onSuccess: (data) => {
        setIsProcessing(false);
        if (data?.authorization_url) {
          localStorage.setItem("paymentReference", data.reference);
          localStorage.setItem("subscriptionPlan", planMethod);
          window.location.href = data.authorization_url;
        } else {
          toast.error("Unable to initialize payment");
        }
      },
      onError: () => {
        setIsProcessing(false);
      },
    });
  };

  // verifyPaymentAfterRedirect when page reloads or on mount
  const verifyPaymentAfterRedirect = async () => {
    const storedReference = localStorage.getItem("paymentReference");
    const subscriptionPlan = localStorage.getItem("subscriptionPlan");

    if (storedReference && subscriptionPlan) {
      try {
        await VerifyPaymentRequest(storedReference, subscriptionPlan);
        // Clear stored data
        localStorage.removeItem("paymentReference");
        localStorage.removeItem("subscriptionPlan");
        await queryClient.invalidateQueries({
          queryKey: ["getUserByIdApi"],
        });
      } catch (error: any) {
        toast.error(error?.data?.message);
      }
    }
  };

  // verifyPaymentAfterRedirect when page reloads or on mount
  useEffect(() => {
    verifyPaymentAfterRedirect();
  }, []);

  return (
    <>
      <section>
        {/* ==== Headings and Tab ===== */}
        <div className="md:flex justify-between items-center">
          <p className="text-sm">
            Your Current Plan:{" "}
            <span className="text-[#33A852]">
              {userData?.data?.subscription}
            </span>
          </p>
          <div className="mt-6 md:mt-0 flex items-center gap-5">
            <div className="border-[1.3px] border-slate-200 flex justify-between items-center text-xs md:text-sm p-1 rounded-3xl w-[200px]">
              <p
                onClick={() => setSelectedBillingCycleTab("Monthly")}
                className={`${
                  selectedBillingCycleTab === "Monthly"
                    ? "text-[#FFFF] bg-green-500"
                    : "text-slate-300"
                } py-1.5 font-medium rounded-3xl text-center w-1/2 cursor-pointer`}
              >
                Monthly
              </p>
              <p
                onClick={() => setSelectedBillingCycleTab("Yearly")}
                className={`${
                  selectedBillingCycleTab === "Yearly"
                    ? "text-[#FFFF] bg-green-500"
                    : "text-slate-300"
                }  py-1.5 font-medium rounded-3xl text-center w-1/2 cursor-pointer`}
              >
                Yearly
              </p>
            </div>
          </div>
        </div>

        {/*=== Pricing Cards === */}
        <div className="md:flex lg:justify-end mt-6 text-xs md:text-sm">
          {selectedBillingCycleTab && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3"
            >
              {plans.map(
                ({ planMethod, amount, color, popular, paymentPlanId }) => (
                  <div
                    key={planMethod}
                    style={{ borderTopColor: color }}
                    className="border-t-[1.3px] rounded-lg w-full md:w-[230px] p-3"
                  >
                    <p
                      style={{ background: popular ? color : "#575D72" }}
                      className={`
                      ${
                        popular ? "visible" : "invisible"
                      } text-[#FFFFFF] py-2 px-4 w-fit  rounded-3xl ml-auto text-xs`}
                    >
                      Most Popular
                    </p>
                    <p className="font-bold text-lg text-[#575D72]">
                      {planMethod === "Starter Monthly"
                        ? "Starter"
                        : planMethod === "Professional Monthly"
                          ? "Professional"
                          : planMethod === "Enterprise Monthly"
                            ? "Enterprise"
                            : planMethod === "Starter Yearly"
                              ? "Starter"
                              : planMethod === "Professional Yearly"
                                ? "Professional"
                                : "Enterprise"}
                    </p>
                    <div className="flex gap-2 items-baseline my-8 text-[#575D72]">
                      <p className="font-bold text-lg md:text-2xl">₦{amount}</p>
                      <p className="text-sm md:text-sm text-[#6C748B] whitespace-nowrap">
                        /{billingCycle.toLowerCase()}
                      </p>
                    </div>
                    <p
                      onClick={() => {
                        handleButtonClick(planMethod);
                        handleAcceptPayment(amount, planMethod);
                      }}
                      className="text-[#FFFFFF] p-3 rounded-md text-center cursor-pointer bg-green-500"
                    >
                      {isSubscribing === planMethod
                        ? "Subscribing..."
                        : "Subscribe"}
                    </p>
                  </div>
                )
              )}
            </motion.div>
          )}
        </div>

        {/* ==== Packge info ==== */}
        <div>
          <PackageInfo />
        </div>
      </section>
    </>
  );
}
