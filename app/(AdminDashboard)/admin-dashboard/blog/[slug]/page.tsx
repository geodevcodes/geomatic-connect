import BlogDetails from "@/app/components/admin-components/BlogDetails";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function BlogDetailsPage({ params }: { params: any }) {
  const session = await auth();
  const blogSlug = params?.slug;
  const token = session?.user?.token;

  if (!blogSlug || !token) {
    redirect("/login");
  }
  return (
    <>
      <main className="min-h-screen lg:p-12 xl:p-20 xl:px-2">
        <BlogDetails blogSlug={blogSlug} />
      </main>
    </>
  );
}
