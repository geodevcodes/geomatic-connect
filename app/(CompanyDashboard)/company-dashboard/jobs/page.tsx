import JobHome from "@/app/components/company-components/JobHome";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Jobs | Geomatic Connect",
  description:
    "Register, Make Request and got accepted into your desired company!",
};
export default async function JobPage() {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen p-6 pt-24 lg:p-12 xl:p-20 lg:pt-24 xl:pt-24 font-sans text-md">
      <JobHome />
    </main>
  );
}
