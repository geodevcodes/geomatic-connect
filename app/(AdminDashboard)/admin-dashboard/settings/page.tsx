import type { Metadata } from "next";
import { auth } from "@/auth";
import Settings from "@/app/components/admin-components/Settings";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings | Geomatic Connect",
  description:
    "Geomatic Connect  is a platform that enables higher institution students to connect with companies offering internships, SIWES, SWEP placements, and other practical training opportunities. It also helps companies find and recruit qualified candidates with ease.",
};
export default async function SettingsPage() {
  const session = await auth();
  const token = session?.user?.token;
  const userId = session?.user?._id;
  if (!session?.user || !token || !userId) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen pt-24 xl:p-2 lg:pt-32 xl:pt-32 font-sans text-md">
      <Settings userId={userId} />
    </main>
  );
}
