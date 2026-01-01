import StudentHome from "@/app/components/student-components/StudentHome";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | Geomatic Connect",
  description:
    "Register, Make Request and got accepted into your desired company!",
};
export default async function Home() {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen max-w-7xl mx-auto p-6 lg:p-12 xl:p-20 xl:px-2 xl:pl-16">
      <p className="lg:hidden mt-16 p-3 bg-[#FEF3F2] text-red-500 text-center text-sm lg:mt-10 xl:mt-2">
        Unlock More Opportunities: Upgrade now to unlock exclusive access to
        more companies and exciting opportunities.
        <Link
          href="/student-dashboard/billing"
          className="font-bold text-sm underline ml-1.5"
        >
          Upgrade now!
        </Link>
      </p>
      <StudentHome session={session} />
    </main>
  );
}
