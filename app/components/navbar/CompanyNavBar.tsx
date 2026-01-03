"use client";
import GeomaticLogoWhite from "@/public/images/Geomatic-Connect-Logo2w.png";
import { useGetUserNotifications } from "@/app/services/notifications.request";
import { ThemeToggle } from "@/app/components/theme-toggle/ThemeToggle";
import GeomaticLogo from "@/public/images/Geomatic-Connect-Logo2b.png";
import { useGetUserProfileRequest } from "@/app/services/users.request";
import { Bell, LogOut, PencilLine, Settings } from "lucide-react";
import Logout from "@/app/components/auth-components/Logout";
import { companyMobileRoutes } from "@/utils/sidebarLinks";
import { avatarPlaceholderUrlThree } from "@/utils/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/app/components/modals/Modal";
import { MdOutlinePriceChange } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CompanyNavBar({ session }: { session: any }) {
  const userId = session?.user?._id;
  const [dropNav, setDropNav] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [currentPage] = useState(1);
  const [limit] = useState(6);
  const { data: userData } = useGetUserProfileRequest(userId as string);
  const { data: notificationData } = useGetUserNotifications(
    currentPage,
    limit
  );

  // Handle click outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isSubscribed = true;

  return (
    <>
      <p
        className={`${!isSubscribed && "hidden"} hidden lg:block mb-6 p-2 text-center text-sm fixed z-[1001] w-full overflow-hidden whitespace-nowrap
        bg-gradient-to-r from-[#fef3f2] via-[#fbcfe8] via-[#fef9c3] via-[#ccfbf1] to-[#f3e8ff]
        dark:from-[#1e1b4b] dark:via-[#312e81] dark:to-[#0f172a] text-black dark:text-white`}
      >
        <motion.span
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "linear",
          }}
          className="inline-block"
        >
          Unlock More Opportunities: Upgrade now to unlock exclusive access to
          more students and exciting opportunities.
          <Link
            href="/company-dashboard/subscribe"
            className="font-bold text-sm underline ml-1.5"
          >
            Upgrade now!
          </Link>
        </motion.span>
      </p>

      <nav
        className={`${isSubscribed && "lg:top-6"} bg-white/50 backdrop-blur-md dark:bg-background/95 dark:backdrop-blur-md fixed px-6 z-[1000] lg:px-12 xl:px-20 py-[20px] left-0 right-0 border-b border-accent`}
      >
        <div className="flex justify-between items-center lg:block ">
          <div className="lg:flex justify-between items-center">
            <div className="flex items-center">
              <span onClick={() => router.back()} className="font-bold">
                <div className="flex items-center">
                  <Image
                    src={GeomaticLogo}
                    alt="Geomatic Brand Logo"
                    width={200}
                    height={100}
                    priority
                    quality={100}
                    className="dark:hidden w-[109px] h-[46px] md:w-[150px] md:h-[56px] lg:w-[138px] xl:w-[150px] object-cover"
                  />
                  <Image
                    src={GeomaticLogoWhite}
                    alt="Geomatic brand logo"
                    width={200}
                    height={100}
                    priority
                    className="hidden dark:block w-[109px] h-[46px] md:w-[150px] md:h-[56px] lg:w-[138px] xl:w-[150px] object-cover"
                  />
                </div>
              </span>
              <div className="border-l border-slate-300 dark:border-muted pl-3 ml-3 space-y-3 hidden md:inline-block">
                <p className="text-xs font-light">
                  Hi {userData?.data?.companyName ?? "Geomatician"}
                </p>
                <p>Welcome 👋</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-x-2 text-sm md:text-base cursor-pointer font-light w-fit">
              <Link
                href={`/company-dashboard/blog`}
                className="relative group text-[#33A852] dark:text-[#00FFAB] flex items-center gap-2"
              >
                <PencilLine className="size-4" />
                <span>Blog</span>
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 bg-muted-foreground origin-left transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
              <Link
                href={`/company-dashboard/subscribe`}
                className="relative group text-[#33A852] dark:text-[#00FFAB] mx-6 flex items-center gap-2"
              >
                <MdOutlinePriceChange className="size-5" />
                <span>Subscribe</span>
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 bg-muted-foreground origin-left transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
              <Link
                href={`/company-dashboard/notifications`}
                className="relative group text-[#33A852] dark:text-[#00FFAB]"
              >
                <span>Notifications</span>
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 bg-muted-foreground origin-left transition-transform duration-200 group-hover:scale-x-100" />
              </Link>

              <div className="flex items-center space-x-3 ml-4">
                <Link
                  href={`/company-dashboard/notifications`}
                  className="bg-slate-300 dark:border-muted dark:border-[0.3px] dark:bg-background dark:hover:bg-muted p-2 rounded-lg flex items-center justify-center"
                >
                  <div className="relative">
                    <Bell size={18} />
                    {notificationData?.meta?.totalUnreadNotifications >= 1 && (
                      <div className="absolute -top-4 -right-4 bg-[#DE3024] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationData?.meta?.totalUnreadNotifications}
                      </div>
                    )}
                  </div>
                </Link>
                <ThemeToggle />
                <div
                  onClick={() => setShowActions((prevState) => !prevState)}
                  className="flex justify-start"
                >
                  <div className="relative cursor-pointer">
                    <Image
                      src={
                        userData?.data?.avatarImage
                          ? userData?.data?.avatarImage
                          : avatarPlaceholderUrlThree
                      }
                      alt="Company avatar pics"
                      width={42}
                      height={42}
                      className="w-[36px] h-[36px] border-[1.3px] border-slate-200 items-center justify-center flex rounded-full object-cover"
                    />

                    <div
                      ref={dropdownRef}
                      className={`${
                        showActions === true ? "block" : "hidden"
                      } bg-white dark:bg-background py-3 shadow-md rounded-lg text-sm border border-[#213f7d0f] dark:border-muted  space-y-2 absolute right-[-1px] lg:right-[-18px] z-[1] top-[50px]`}
                    >
                      <Link
                        href={`/company-dashboard/settings`}
                        className="hover:bg-gray-100 dark:hover:bg-accent dark:text-accent-foreground flex items-center gap-x-2 cursor-pointer p-2 pr-10 pl-4"
                      >
                        <Settings
                          size={18}
                          className="text-gray-600 dark:text-accent-foreground"
                        />
                        Settings
                      </Link>
                      <div
                        className="hover:bg-gray-100 dark:hover:bg-accent flex items-center gap-x-2 cursor-pointer text-red-600 p-2 pr-20 pl-4"
                        onClick={() => {
                          setShowActions(false);
                          setShowLogOut(true);
                        }}
                      >
                        <LogOut size={20} />
                        Logout
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ======= Menu button (Hamburger button) ======*/}
          <div className="lg:hidden flex space-x-3">
            <ThemeToggle />
            <Link
              href={`/company-dashboard/notifications`}
              className="bg-slate-300 dark:border-muted dark:border-[0.3px] dark:bg-background dark:hover:bg-muted p-2 rounded-lg flex items-center justify-center"
            >
              <div className="relative">
                <Bell size={18} />
                {notificationData?.meta?.totalUnreadNotifications >= 1 && (
                  <div className="absolute -top-4 -right-4 bg-[#DE3024] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationData?.meta?.totalUnreadNotifications}
                  </div>
                )}
              </div>
            </Link>

            <HiMenu
              className="transition"
              size={32}
              onClick={() => {
                setDropNav(true);
              }}
            />
          </div>
        </div>

        {/*====== Mobile view ======*/}
        <section className="lg:hidden text-black">
          <AnimatePresence>
            {dropNav && (
              <motion.div
                initial={{ x: "90vw" }}
                animate={{ x: 0 }}
                exit={{ x: "90vw" }}
                transition={{ type: "tween", duration: 1 }}
                className="fixed top-0 right-0 w-[80%] min-h-screen bg-[#F6F8FD] z-30 pl-4 dark:bg-slate-950 dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:0px_0px]"
              >
                <div className="flex justify-between p-3 pr-6">
                  <a href="#" className="flex items-center">
                    <Image
                      src={GeomaticLogo}
                      alt="Geomatic brand logo"
                      width={80}
                      height={80}
                      priority
                      className="w-[109px] h-[46px] object-cover dark:hidden"
                    />
                    <Image
                      src={GeomaticLogoWhite}
                      alt="Geomatic brand logo"
                      width={80}
                      height={80}
                      priority
                      quality={100}
                      className="w-[109px] h-[46px] object-cover hidden dark:block"
                    />
                  </a>
                  <HiX
                    className="text-lg transition mt-2 dark:text-accent-foreground"
                    size={32}
                    onClick={() => {
                      setDropNav(false);
                    }}
                  />
                </div>
                <ul className="flex flex-col mt-4 font-light text-sm rounded-lg space-y-3">
                  {companyMobileRoutes.map((route, index) => (
                    <li
                      key={index}
                      className="block py-2 pl-1.5 mx-2 pr-3 border-b border-slate-200 dark:border-muted dark:text-accent-foreground"
                    >
                      <Link
                        onClick={() => {
                          setDropNav(false);
                        }}
                        href={route.href}
                        className="w-full inline-block"
                      >
                        {route.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div
                  onClick={() => setShowLogOut(true)}
                  className="mt-10 ml-3 text-sm flex items-center space-x-4 hover:bg-[#EDEDF1] p-2 pr-3  cursor-pointer rounded-lg w-fit font-light text-white shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:bg-muted dark:bg-gradient-to-r dark:from-muted dark:to-muted-foreground"
                >
                  <LogOut size={16} />
                  <p>Log out</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </nav>

      <Modal show={showLogOut} onClose={() => setShowLogOut(false)}>
        <Logout setShowLogOut={setShowLogOut} />
      </Modal>
    </>
  );
}
