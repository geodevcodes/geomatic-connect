"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  useResendVerifyOTPRequest,
  useVerifyEmailRequest,
} from "@/app/services/auth.request";
import { toast } from "sonner";
import Link from "next/link";

interface VerifyEmailProps {
  userEmail: string;
}
export default function VerifyEmail({ userEmail }: VerifyEmailProps) {
  const { mutate: verifyUserEmail, isPending } = useVerifyEmailRequest();
  const { mutate: resendVerifyOTP } = useResendVerifyOTPRequest();
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 4).split("");
      for (let i = 0; i < 4; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 3 ? lastFilledIndex + 1 : 3;

      // Check if the inputRef is not null before focusing
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex]!.focus();
      }
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 3) {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]!.focus();
        }
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      const verificationCode = code.join("");
      console.log(verificationCode, "this is the code");
      const payload = {
        code: verificationCode,
      };
      verifyUserEmail(
        { payload },
        {
          onSuccess: (data) => {
            toast.success(data?.message);
            setTimeout(() => {
              router.push("/login");
            }, 5000);
          },
          onError: () => {
            console.log("error occured");
          },
        }
      );
    },
    [code, router]
  );

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code, handleSubmit]);

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
      <div className="bg-[#F1F4EA] overflow-y-hidden md:w-[40%] xl:w-1/3 h-full  py-20 text-[#1F4D36]">
        <div className="px-4 w-ful max-w-[340px] mx-auto">
          <p className="text-center text-[24px] ">Verify Email</p>
          <p className="text-center text-sm mt-3 mb-6 max-w-[250px] mx-auto">
            Enter the 6-digit code sent to your email address.
          </p>

          <form onSubmit={handleSubmit}>
            {/* =======Verification Code ===== */}
            <div className="mt-4 flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-16 h-16 text-center text-5xl font-bold bg-[#5cd096] dark:bg-[#5cd096] text-white dark:text-[#FFFFFF]  border-2 border-gray-600 px-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg"
                />
              ))}
            </div>
            <button
              disabled={isPending || code.some((digit) => !digit)}
              className="px-8 py-2 cursor-pointer  mt-4 bg-[#1F4D36] text-[16px] text-white dark:text-[#FFFFFF] rounded-lg w-full  transition duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(31,77,54,0.7)] hover:brightness-150"
            >
              {isPending ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* ====== Don't have an account ======  */}
          <div className="mt-4 text-sm">
            <div className="text-center text-xs flex items-center justify-center">
              <p>Didn&apos;t receive the email? </p>
              <button
                onClick={() => resendVerificationCode()}
                className="hover:underline ml-2"
              >
                Click to resend
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
    </>
  );
}
