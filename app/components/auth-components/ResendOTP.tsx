"use client";
import { useResendVerifyOTPRequest } from "@/app/services/auth.request";
import { MdOutlineMail } from "react-icons/md";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ResendOTP({ userEmail }: any) {
  const { mutate: resendVerifyOTP, isPending } = useResendVerifyOTPRequest();

  // Resend verification code
  const resendVerificationCode = async () => {
    const payload = {
      email: userEmail,
    };

    resendVerifyOTP(
      { payload },
      {
        onSuccess: (data) => {
          toast.success(data?.message);
        },
        onError: () => {
          console.log("error occured");
        },
      }
    );
  };
  return (
    <>
      <div className="fixed w-full inset-0 z-[1005] flex justify-center overflow-hidden bg-white">
        <div className="bg-[#FFFFFF] rounded-lg mx-4 px-2 pt-10 xl:p-16 md:w-[500px] text-[#575D72] md:mx-auto flex flex-col gap-y-6">
          <div className="rounded-full bg-[#e3fced] p-1.5 w-fit self-center">
            <div className="rounded-full bg-[#d1fadf] p-2 w-fit">
              <MdOutlineMail size={35} color="#61d162" />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-bold text-lg md:text-xl lg:text-2xl text-center text-[#363944]">
              Check Your Email
            </p>
            <p className="text-sm md:text-base lg:text-xl font-light text-[#363944] text-center mt-3">
              We have sent a verification link to your email
              <span className="ml-3 font-bold text-[#1F4D36]">
                ({userEmail})
              </span>
              .
              <br /> If you do not receive it in your inbox, please check your
              spam or junk folder.
            </p>
            {/* ====== Don't Receive code ======  */}
            <div className="mt-8 text-sm">
              <div className="text-center text-sm md:text-base flex items-center justify-center">
                <p>Didn&apos;t receive the email? </p>
                <button
                  onClick={() => resendVerificationCode()}
                  className="hover:underline ml-2 text-[#1F4D36]"
                >
                  {isPending ? "Resending.." : "Click to resend"}
                </button>
              </div>
              <Link
                href="/login"
                className="underline flex items-center justify-center mt-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
