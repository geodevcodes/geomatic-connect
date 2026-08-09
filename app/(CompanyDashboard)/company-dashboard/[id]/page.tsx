import StudentDetails from "@/app/components/company-components/StudentDetails";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

// Helper function to validate the studentId
const isValidStudentId = (id: any) => {
  const regex = /^[a-f\d]{24}$/i; // Regex for a 24-character MongoDB ObjectId
  return regex.test(id);
};

export default async function StudentDetailsPage({ params }: { params: any }) {
  const studentId = params.id;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  if (!studentId || !isValidStudentId(studentId)) {
    notFound(); // Returns a 404 page
  }
  return (
    <>
      <main className="min-h-screen p-6 lg:p-12 xl:p-20 xl:px-2 xl:pl-16">
        <StudentDetails studentId={studentId} session={session} />
      </main>
    </>
  );
}
