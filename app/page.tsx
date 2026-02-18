import LeftContainer from "./components/auth-components/leftContainer";
import LoginHome from "@/app/components/auth-components/LoginHome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Geomatic Connect",
  description:
    "Register, Make Request and got accepted into your desired company!",
};

export default function Home() {
  return (
    <>
      <div className="text-[#1F4D36] md:flex justify-between h-screen overflow-y-hidden">
        <LeftContainer />
        <LoginHome />
      </div>
    </>
  );
}
