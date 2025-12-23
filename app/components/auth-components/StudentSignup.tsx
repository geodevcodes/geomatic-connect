"use client";
import { institutionData, stateData } from "@/utils/FilterData";
import { RegisterRequest } from "@/app/services/auth.request";
import ReactSelect from "@/app/components/inputs/ReactSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import PhoneInput from "react-phone-number-input";
import { BiHide, BiShow } from "react-icons/bi";
import "react-phone-number-input/style.css";
import { useForm } from "react-hook-form";
import ResendOTP from "./ResendOTP";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import * as yup from "yup";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  institutionName: yup.string().required("Institution is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must not exceed 32 characters"),
  state: yup.string().required("State is required"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .min(7, "Password must be at least 7 characters")
    .max(14, "Password must not exceed 14 characters"),
});

export default function StudentSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRendOTP, setShowRendOTP] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({ resolver: yupResolver(schema) });

  //Register User submission Logic
  const onSubmitHandler = async (data: any) => {
    setIsSaving(true);
    const body = {
      fullName: data?.fullName,
      institutionName: data?.institutionName,
      email: data?.email,
      password: data?.password,
      state: data?.state,
      phoneNumber: data?.mobileNumber,
      role: "User",
    };

    try {
      const response = await RegisterRequest(body);
      toast.success(response?.message);
      setTimeout(() => {
        setUserEmail(response?.data?.email);
        setShowRendOTP(true);
      }, 3000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {showRendOTP ? (
        <ResendOTP userEmail={userEmail} />
      ) : (
        <div>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            {/* =======Full Name ===== */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Full Name"
                {...register("fullName")}
                maxLength={32}
                className={`${
                  errors.fullName
                    ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                    : "bg-[#FFFFFF]"
                } px-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full`}
              />
            </div>

            {/* =======Institution ===== */}
            <div
              className={`${
                errors.institutionName
                  ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                  : "bg-[#FFFFFF]"
              } mt-4 rounded-lg cursor-pointer  w-full`}
            >
              <ReactSelect
                options={institutionData}
                placeholder="Your Institution"
                padding={"4px"}
                borderRadius={"10px"}
                border="none"
                backgroundColor={errors.institutionName ? "#FEF3F2" : "#ffffff"}
                onChange={(option: any) => {
                  setValue("institutionName", option?.value || "");
                  trigger("institutionName"); // Trigger validation
                }}
              />
            </div>

            {/* ======= State ===== */}
            <div
              className={`${
                errors.state
                  ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                  : "bg-[#FFFFFF]"
              } mt-4 rounded-lg cursor-pointer  w-full`}
            >
              <ReactSelect
                options={stateData}
                placeholder="Your Location"
                padding={"4px"}
                borderRadius={"10px"}
                border="none"
                backgroundColor={errors.state ? "#FEF3F2" : "#ffffff"}
                onChange={(option: any) => {
                  setValue("state", option?.value || "");
                  trigger("state");
                }}
              />
            </div>

            {/* =======Mobile Number ===== */}
            <div className="mt-4">
              <PhoneInput
                placeholder="Enter phone number"
                international={false}
                defaultCountry="NG"
                countries={["NG"]}
                onChange={(value: any) => {
                  setValue("mobileNumber", value || "");
                  trigger("mobileNumber");
                }}
                rules={{ required: true }}
                className={`${
                  errors.mobileNumber
                    ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                    : "bg-[#FFFFFF]"
                } phone-input input-phone-number border border-[#FFFFFF] text-[#000000]`}
              />
            </div>

            {/* =======Email ===== */}
            <div className="mt-4">
              <input
                type="email"
                placeholder="E-mail"
                {...register("email")}
                maxLength={40}
                className={`${
                  errors.email
                    ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                    : "bg-[#FFFFFF]"
                }  px-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full`}
              />
            </div>

            {/* =======  Password ======== */}
            <div className="mt-4 relative">
              <div>
                <input
                  type={`${showPassword ? "text" : "password"}`}
                  placeholder="Password"
                  {...register("password")}
                  maxLength={32}
                  className={`${
                    errors.password
                      ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                      : "bg-[#FFFFFF]"
                  }  pr-12 pl-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full text-[#000000]`}
                />
              </div>
              <span
                className="absolute cursor-pointer bottom-3 right-2 pt-4 flex items-center mr-[0.25rem] text-[#FF8447]"
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

            {/* ====Terms and service ===== */}
            <div className="text-xs mt-6 text-center">
              <p>
                By signing up you agree to our
                <Link href="#" className="underline mx-1">
                  Terms of Service
                </Link>
                and
                <Link href="#" className="underline ml-1">
                  Privacy Policy.
                </Link>
              </p>
            </div>

            <button
              disabled={isSaving}
              className="px-8 py-2 cursor-pointer  mt-4 bg-[#1F4D36] text-[16px] text-white rounded-lg w-full  transition duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(31,77,54,0.7)] hover:brightness-150"
            >
              {isSaving ? "Loading...." : "Sign-up for free"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
