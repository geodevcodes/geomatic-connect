import Notification from "@/app/components/company-components/Notifications";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Notifications | Geomatic Connect",
  description:
    "Geomatic Connect  is a platform that enables higher institution students to connect with companies offering internships, SIWES, SWEP placements, and other practical training opportunities. It also helps companies find and recruit qualified candidates with ease.",
};
export default async function NotificationPage() {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen p-6 pt-24 lg:p-12 xl:p-20 lg:pt-32 xl:pt-32 font-sans text-md">
      <div className="w-full font-sans text-md ">
        <p className="text-2xl font-bold mb-2">Notification</p>
        <p className="max-w-[550px] leading-8 font-light">
          Stay updated with real-time notifications on application requests.
          Geomatic Connect keeps you informed and engaged on any applications.
          All alerts are personalized and available anytime in your dashboard.
        </p>
      </div>
      <section className="h-fit border mt-8 rounded-md">
        <Notification token={token} />
      </section>
    </main>
  );
}
