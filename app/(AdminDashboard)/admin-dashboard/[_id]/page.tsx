import UsersDetails from "@/app/components/admin-components/UsersDetails";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

// Helper function to validate the userId
const isValidUserId = (id: any) => {
  const regex = /^[a-f\d]{24}$/i; // Regex for a 24-character MongoDB ObjectId
  return regex.test(id);
};

export default async function UsersDetailsPage({ params }: { params: any }) {
  const session = await auth();
  const token = session?.user?.token;
  const userId = params?._id;

  if (!token) {
    redirect("/login");
  }

  if (!userId || !isValidUserId(userId)) {
    notFound(); // Returns a 404 page
  }
  return (
    <>
      <main className="min-h-screen pt-6  xl:py-10 xl:px-2 ">
        <UsersDetails userId={userId} />
      </main>
    </>
  );
}
