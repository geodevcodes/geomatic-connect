"use client";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Redirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      let attempts = 0;
      const maxAttempts = 3;

      const checkSession = async () => {
        attempts++;
        const session = await getSession();

        if (session?.user?.token && session?.user?.role) {
          const routeMap = {
            Admin: "/admin-dashboard",
            Company: "/company-dashboard",
            User: "/student-dashboard",
          };

          const route =
            routeMap[session.user.role as keyof typeof routeMap] ||
            "/student-dashboard";
          return router.push(route);
        } else if (attempts < maxAttempts) {
          setTimeout(checkSession, 500); // Try again after 500ms
        } else {
          toast.error("Unable to verify your session");
          return router.push("/");
        }
      };

      await checkSession();
    };

    redirectUser();
  }, [router]);

  return (
    <div className="flex justify-center h-screen bg-[#011727]">
      <div>
        <p className="animate-pulse text-lg lg:text-2xl lg:font-semibold text-center font-medium text-[#ffffff] pt-16 px-6">
          Just a moment while we get things ready for you...
        </p>
        <p className="text-base text-[#ffffff] text-center mt-2 animate-pulse">
          Hang tight, you&apos;r almost there!
        </p>
      </div>
    </div>
  );
}
