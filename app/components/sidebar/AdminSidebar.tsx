"use client";
import { ChevronRight, LogOut, Settings } from "lucide-react";
import { adminNavItems } from "@/utils/sidebarLinks";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AdminSidebar() {
  const [showSignOutProfile, setShowSignOutProfile] = useState(false);
  const pathname = usePathname();
  const addSignOutProfileRef = useRef(null);
  console.log(pathname);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addSignOutProfileRef.current &&
        !(addSignOutProfileRef.current as HTMLDivElement).contains(
          event.target as Node
        )
      ) {
        setShowSignOutProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addSignOutProfileRef]);

  return (
    <>
      <div className="flex flex-col justify-between min-h-screen">
        <nav className="grid items-start gap-2 ">
          {adminNavItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F9FAFB] dark:hover:bg-muted",
                  pathname === item.href
                    ? "bg-[#ECF1F7] dark:bg-muted"
                    : "bg-transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4 text-[#33A852] dark:text-[#00FFAB]" />
                <span className="font-medium">{item.name}</span>
              </span>
            </Link>
          ))}
        </nav>

        {/* ============ Settings dropdown & Log out ========== */}
        <div>
          <div
            onClick={() => setShowSignOutProfile((prevState) => !prevState)}
            className="pb-40 hidden md:block"
          >
            <div className="flex items-center gap-2  cursor-pointer">
              <p className="bg-green-600 p-1 xl:p-2 rounded-md text-sm text-[#FFFFFF]">
                GC
              </p>
              <div className="flex items-center justify-between space-x-4 w-full">
                <div className="text-sm space-y-2">
                  <p>Admin</p>
                  <p className="whitespace-normal break-words overflow-hidden text-ellipsis  line-clamp-1">
                    Geomatics Connect
                  </p>
                </div>
                <ChevronRight size={32} />
              </div>
            </div>
            {/* ===drop down === */}
            <div
              ref={addSignOutProfileRef}
              className={`${
                showSignOutProfile === true ? "block" : "hidden"
              }  bg-white h-fit absolute left-48 bottom-36 border-[1.3px] border-gray-400 w-[200px] rounded-lg mt-2 py-3 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] space-y-2 text-[#24252D]`}
            >
              <div className="flex items-center space-x-4 hover:bg-gray-100 p-2 pr-3 cursor-pointer">
                <Settings size={16} />
                <Link className="block" href="/admin-dashboard/settings">
                  Settings
                </Link>
              </div>
              <div
                onClick={() => signOut()}
                className="flex items-center space-x-4 hover:bg-gray-100 p-2 pr-3 cursor-pointer"
              >
                <LogOut size={16} />
                <p>Log out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
