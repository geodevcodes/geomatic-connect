import LeftContainer from "@/app/components/auth-components/leftContainer";
import SignupHome from "@/app/components/auth-components/SignupHome";

import { Suspense } from "react";

export default function Signup() {
  return (
    <div className="text-[#1F4D36] md:flex justify-between h-screen xl:overflow-y-hidden">
      <LeftContainer />
      <Suspense
        fallback={<div className="bg-[#F1F4EA] md:w-[40%] xl:w-1/3 h-full" />}
      >
        <SignupHome />
      </Suspense>
    </div>
  );
}
