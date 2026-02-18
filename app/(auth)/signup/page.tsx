"use client";
import StudentSignup from "@/app/components/auth-components/StudentSignup";
import { useRouter, useSearchParams } from "next/navigation";
import OnboardingHome from "@/app/components/auth-components/Onboarding";
import CompanySignup from "@/app/components/auth-components/CompanySignup";
import LeftContainer from "./leftContainer";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SignUp() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "onboarding";
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  //Whenever status changes, push to URL
  useEffect(() => {
    const current = searchParams.get("status");
    if (status !== current) {
      router.push(`?status=${status}`, { scroll: false });
    }
  }, [status, router, searchParams]);

  return (
    <div className="text-[#1F4D36] md:flex justify-between h-screen xl:overflow-y-hidden">
      <LeftContainer />
      {(status === "onboarding" ||
        (status !== "Company" && status !== "User")) && (
        <OnboardingHome setStatus={setStatus} />
      )}

      {status === "Company" && (
        <div className="bg-[#F1F4EA] md:w-[40%] xl:w-1/3 h-full py-8 pb-20 xl:py-16 text-[#1F4D36]">
          <div className="px-4 w-ful max-w-[340px] mx-auto">
            <p className="text-center text-[18px] font-medium">
              Start Connecting For Free!
            </p>
            <p className="text-center">Register an account</p>
            <div>
              <CompanySignup />
            </div>
            {/* ====== Already have an account ======  */}
            <div className="mt-4 text-center text-xs flex items-center justify-center">
              <p>Already have an account ? </p>
              <Link href="/login" className="underline ml-2">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
      {status === "User" && (
        <div className="bg-[#F1F4EA] md:w-[40%] xl:w-1/3 h-full py-8 pb-20 xl:py-16 text-[#1F4D36]">
          <div className="px-4 w-ful max-w-[340px] mx-auto">
            <p className="text-center text-[18px] font-medium">
              Start Connecting For Free!
            </p>
            <p className="text-center">Register an account</p>
            <div>
              <StudentSignup />
            </div>
            {/* ====== Already have an account ======  */}
            <div className="mt-4 text-center text-xs flex items-center justify-center">
              <p>Already have an account ? </p>
              <Link href="/login" className="underline ml-2">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
