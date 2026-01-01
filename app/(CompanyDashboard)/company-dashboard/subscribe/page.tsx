import type { Metadata } from "next";
import { auth } from "@/auth";
import Subscribe from "@/app/components/company-components/Subscribe";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Subscribe | Geomatic Connect",
  description:
    "Geomatic Connect  is a platform that enables higher institution students to connect with companies offering internships, SIWES, SWEP placements, and other practical training opportunities. It also helps companies find and recruit qualified candidates with ease.",
};

export default async function SubscribePage() {
  const session = await auth();
  const token = session?.user?.token;
  const userId = session?.user?._id;
  if (!session?.user || !token || !userId) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen p-6 pt-24 lg:p-12 xl:p-20 lg:pt-32 xl:pt-32 font-sans text-md">
      <div className="w-full font-sans text-md ">
        <p className="text-2xl font-bold mb-2">Pricing</p>
        <p className="max-w-[550px] leading-8 font-light">
          All paid plans on Geomatic Connect provide unlimited access to
          internship and practical training opportunities. Each account is
          intended for individual use only. For dedicated support and priority
          features, reach out to our team for exclusive assistance.
        </p>
      </div>
      <section className="h-fit border mt-8 p-6 rounded-md">
        <Subscribe userId={userId} />
      </section>
    </main>
  );
}
