import type { Metadata } from "next";
import { auth } from "@/auth";
import AdminHome from "@/app/components/admin-components/AdminHome";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Geomatic Connect",
  description:
    "Register, Make Request and got accepted into your desired company!",
};
export default async function HomePage() {
  const session = await auth();
  const token = session?.user?.token;
  if (!session?.user || !token) {
    redirect("/login");
  }
  return (
    <div>
      <AdminHome />
    </div>
  );
}
