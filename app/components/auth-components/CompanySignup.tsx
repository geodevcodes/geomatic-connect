"use client";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterRequest } from "@/app/services/auth.request";
import ReactSelect from "@/app/components/inputs/ReactSelect";
import { stateData } from "@/utils/FilterData";

const schema = yup.object().shape({
  companyName: yup.string().required("Company Name is required"),
  companyAddress: yup.string().required("Company Address is required"),
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
  professionalId: yup.string().required("Professional ID is required"),
});

export default function CompanySignup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: registerUserRequest, isPending: isSaving } =
    useRegisterRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({ resolver: yupResolver(schema) });

  //Register User submission Logic
  const onSubmitHandler = async (data: any) => {
    const formData = {
      companyName: data?.companyName,
      companyAddress: data?.companyAddress,
      email: data?.email,
      password: data?.password,
      state: data?.state,
      professionalId: data?.professionalId,
      role: "Company",
    };
    await registerUserRequest(
      { formData },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.push("/verify-email");
          }, 5000);
        },
        onError: () => {
          console.log("error creating user");
        },
      }
    );
  };
  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          {/* =======Company Name ===== */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Your Company Name"
              {...register("companyName")}
              maxLength={32}
              className={`${
                errors.companyName
                  ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                  : ""
              } px-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full`}
            />
          </div>

          {/* ======= State ===== */}
          <div
            className={`${
              errors.state ? "border-[1.3px] border-red-500 bg-[#FEF3F2]" : ""
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
                trigger("state"); // Trigger validation
              }}
            />
          </div>

          {/* ======= Professional ID (SURCON ID) ===== */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Your SURCON ID"
              {...register("professionalId")}
              maxLength={32}
              className={`${
                errors.professionalId
                  ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                  : ""
              } px-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full`}
            />
          </div>

          {/* =======Company Address ===== */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Company Address"
              {...register("companyAddress")}
              maxLength={32}
              className={`${
                errors.companyAddress
                  ? "border-[1.3px] border-red-500 bg-[#FEF3F2]"
                  : ""
              } px-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full`}
            />
          </div>

          {/* =======Email ===== */}
          <div className="mt-4">
            <input
              type="email"
              placeholder="Your Company E-mail"
              {...register("email")}
              maxLength={40}
              className={`${
                errors.email ? "border-[1.3px] border-red-500 bg-[#FEF3F2]" : ""
              } px-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full`}
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
                    : ""
                } pr-12 pl-3 py-2.5 focus:outline-none placeholder:text-sm cursor-text flex justify-between rounded-lg w-full`}
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
    </>
  );
}
