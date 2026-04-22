"use client";
import GeomaticLogo from "@/public/images/Geomatic-Connect-Logo2b.png";
import { LuGraduationCap, LuBuilding2 } from "react-icons/lu";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface OnboardingHomeProps {
  setStatus: any;
}
const options = [
  {
    id: "student_01",
    role: "User",
    icon: LuGraduationCap,
    title: "I'm a Geomatics Student",
    description: "Learn, connect, and grow in the geospatial field",
  },
  {
    id: "company_01",
    role: "Company",
    icon: LuBuilding2,
    title: "I represent a Geomatics Company",
    description: "Hire talent, post projects, and grow your network",
  },
];

export default function OnboardingHome({ setStatus }: OnboardingHomeProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    setTimeout(() => setStatus(selected), 300);
  };

  return (
    <div className="bg-[#F1F4EA] overflow-y-hidden md:w-[40%] xl:w-1/3 h-full pb-20 text-[#1F4D36]">
      <div className="px-4 w-full max-w-[380px] mx-auto flex flex-col h-full justify-center">
        <Image
          src={GeomaticLogo}
          alt="Geomatic connect brand logo"
          width={200}
          height={200}
          priority
          className="mx-auto object-cover w-[120px] z-[1000] h-[100px] relative text-[#1F4D36] text-4xl text-center flex justify-center items-center"
        />

        {/* Header */}
        <p className="text-center text-[22px] font-semibold leading-snug">
          How are you planning to use <br /> Geomatic Connect?
        </p>
        <p className="text-center text-sm text-[#1F4D36]/70 mt-2">
          We&apos;ll tailor your experience to your needs. <br /> You can change
          this later.
        </p>

        {/* Options */}
        <div className="mt-8 flex flex-col gap-4">
          {options.map(({ id, role, icon: Icon, title, description }) => (
            <button
              key={id}
              onClick={() => setSelected(role)}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center gap-4 cursor-pointer
                ${
                  selected === role
                    ? "border-[#1F4D36] bg-[#1F4D36]/10 shadow-sm"
                    : "border-transparent bg-white hover:border-[#1F4D36]/30"
                }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  selected === role
                    ? "bg-[#1F4D36] text-white"
                    : "bg-[#F1F4EA] text-[#1F4D36]"
                } transition-colors duration-200`}
              >
                <Icon size={22} />
              </div>
              <div>
                <p className="font-semibold text-[15px]">{title}</p>
                <p className="text-xs text-[#1F4D36]/60 mt-0.5">
                  {description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`mt-8 w-full py-3 rounded-xl text-white font-medium text-[15px] transition-all duration-300
            ${
              selected
                ? "bg-[#1F4D36] hover:shadow-[0_0_20px_rgba(31,77,54,0.5)] hover:brightness-110 cursor-pointer"
                : "bg-[#1F4D36]/30 cursor-not-allowed"
            }`}
        >
          Continue
        </button>
        <div className="mt-4 text-center text-xs flex items-center justify-center">
          <p>Already have an account?</p>
          <Link href="/login" className="underline ml-2">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
