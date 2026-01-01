import CompanyHome from "@/app/components/company-components/CompanyHome";
// import TawkChat from "@/app/components/chatbot/TawkChat";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen p-6 lg:p-12 xl:p-20 xl:px-2 xl:pl-16">
      <p className="lg:hidden mt-16 p-3 bg-[#FEF3F2] text-red-500 text-center text-sm lg:mt-10 xl:mt-2">
        Unlock More Opportunities: Upgrade now to unlock exclusive access to
        more students and exciting opportunities.
        <Link
          href="/company-dashboard/subscribe"
          className="font-bold text-sm underline ml-1.5"
        >
          Upgrade now!
        </Link>
      </p>
      <CompanyHome session={session} />
      {/* <TawkChat /> */}
    </main>
  );
}
