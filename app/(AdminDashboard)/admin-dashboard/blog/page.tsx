import BlogHome from "@/app/components/admin-components/BlogHome";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Blog | Geomatic Connect",
  description:
    "Geomatic Connect  is a platform that enables higher institution students to connect with companies offering internships, SIWES, SWEP placements, and other practical training opportunities. It also helps companies find and recruit qualified candidates with ease.",
};
export default async function BlogPage() {
  const session = await auth();
  const token = session?.user?.token;
  if (!token) {
    redirect("/login");
  }
  return (
    <div>
      <BlogHome />
    </div>
  );
}
