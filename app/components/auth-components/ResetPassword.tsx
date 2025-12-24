"use client";
import { useResetPasswordRequest } from "@/app/services/auth.request";
import { yupResolver } from "@hookform/resolvers/yup";
import { BiHide, BiShow } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import * as yup from "yup";

interface ResetPasswordProps {
  token: string;
}

const schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must not exceed 15 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .min(6, "Confirm Password must be at least 6 characters")
    .max(32, "Confirm Password must not exceed 15 characters"),
});

export default function ResetPassword({ token }: ResetPasswordProps) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPasswordRequest();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // REACT HOOK FORM LOGIC
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  //Reset Password User submission Logic
  const onSubmitHandler = async (data: any) => {
    if (data?.password !== data?.confirmPassword) {
      toast.error("Password does not match");
      return;
    }
    const payload = {
      password: data?.password,
    };
    resetPassword(
      { payload, token },
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
  };

  return (
    <>
      <div className="bg-[#F1F4EA] overflow-y-hidden md:w-[40%] xl:w-1/3 h-full  py-20 text-[#1F4D36]">
        <div className="px-4 w-ful max-w-[340px] mx-auto">
          <p className="text-center text-[24px] ">Reset Password</p>
          <p className="text-center text-sm mt-3 mb-6 max-w-[290px] mx-auto">
            Your new password must be different to previously used passwords.
          </p>

          <form onSubmit={handleSubmit(onSubmitHandler)}>
            {/* =======  Password ======== */}
            <div className="mt-4 relative">
              <div>
                <input
                  type={`${showPassword ? "text" : "password"}`}
                  placeholder="New Password"
                  {...register("password")}
                  maxLength={32}
                  className={`${
                    errors.password
                      ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                      : ""
                  } dark:bg-[#FFFFFF] pr-12 pl-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full`}
                />
              </div>
              <span
                className="absolute cursor-pointer bottom-4 right-2 pt-4 flex items-center mr-[0.25rem] text-[#FF8447]"
                onClick={() => setShowPassword(!showPassword)}
              >
                <BiHide
                  size={18}
                  className={
                    showPassword === false
                      ? "hidden items-center cursor-pointer"
                      : "text-gray-500"
                  }
                />
                <BiShow
                  size={18}
                  className={
                    showPassword === true
                      ? "hidden items-center cursor-pointer"
                      : "text-gray-500"
                  }
                />
              </span>
            </div>

            {/* ======= Confirm Password ======== */}
            <div className="mt-4 relative">
              <div>
                <input
                  type={`${showConfirmPassword ? "text" : "password"}`}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  maxLength={32}
                  className={`${
                    errors.confirmPassword
                      ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                      : ""
                  } dark:bg-[#FFFFFF] pr-12 pl-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full`}
                />
              </div>
              <span
                className="absolute cursor-pointer bottom-4 right-2 pt-4 flex items-center mr-[0.25rem] text-[#FF8447]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <BiHide
                  size={18}
                  className={
                    showConfirmPassword === false
                      ? "hidden items-center cursor-pointer"
                      : "text-gray-500"
                  }
                />
                <BiShow
                  size={18}
                  className={
                    showConfirmPassword === true
                      ? "hidden items-center cursor-pointer"
                      : "text-gray-500"
                  }
                />
              </span>
            </div>

            <button
              disabled={isPending}
              className="px-8 py-2 cursor-pointer  mt-4 bg-[#1F4D36] text-[16px] text-white rounded-lg w-full  transition duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(31,77,54,0.7)] hover:brightness-150"
            >
              {isPending ? "Resetting..." : "Set New Password"}
            </button>
          </form>

          {/* ====== Don't have an account ======  */}
          <div className="mt-4 text-center text-sm">
            <Link
              href="/login"
              className="underline flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
