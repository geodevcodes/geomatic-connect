import type { Metadata } from "next";
import { auth } from "@/auth";
import Settings from "@/app/components/student-components/Settings";
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
    <main className="min-h-screen p-6 pt-24 lg:p-12 xl:p-20 lg:pt-32 xl:pt-32 font-sans text-md">
      <div className="w-full font-sans text-md ">
        <p className="text-2xl font-bold mb-2">Profile</p>
        <p className="text-gray-500">Manage the settings of your account</p>
      </div>
      <section className="h-fit border mt-8 p-6 rounded-md">
        <Settings userId={userId} />
      </section>
    </main>
  );
}
