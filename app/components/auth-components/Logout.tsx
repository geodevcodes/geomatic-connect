"use client";
import { CircleAlert } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface LogoutProps {
  setShowLogOut?: any;
}

export default function Logout({ setShowLogOut }: LogoutProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <div className="bg-white dark:bg-background p-8 rounded-[0.63rem]  mx-auto min-w-full">
      <div className="bg-[#FEF3F2] p-3 w-fit rounded-full mx-auto">
        <div className="bg-[#FEE4E2] p-3 rounded-full">
          <CircleAlert color="#DE3024" size={32} />
        </div>
      </div>
      <h2 className="text-xl mb-4 text-center mt-6 ">Log out</h2>
      <p className="text-md  text-center text-[#6C748B]">
        Are you sure you want to log out?
      </p>
      {/*======= Cancel Button and Delete Button ====== */}
      <div className="mt-12 flex space-x-4">
        <div
          className="border-[1.5px] border-slate-300 dark:border-muted dark:text-muted-foreground rounded-[8px] px-[28px] py-[12px] cursor-pointer text-center w-1/2 lg:w-[230px]"
          onClick={() => setShowLogOut(false)}
        >
          Cancel
        </div>
        <button
          type="button"
          className={
            "bg-[#D92D20] hover:bg-[#D92D20]/90 rounded-[8px] text-white px-[28px] cursor-pointer py-[12px] text-center  w-1/2 lg:w-[230px] whitespace-nowrap"
          }
          onClick={() => {
            setIsLoggingOut(true);
            signOut();
          }}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );
}
