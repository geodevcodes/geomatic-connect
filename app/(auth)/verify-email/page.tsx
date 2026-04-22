import LeftContainer from "@/app/components/auth-components/leftContainer";
import VerifyEmail from "@/app/components/auth-components/VerifyEmail";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage({ searchParams,}: {searchParams: any}) {
  const userEmail = searchParams.email;
  const verifyToken = searchParams?.verifyToken;
  if (!verifyToken || !userEmail) {
    redirect("/login");
  }
  return (
    <div className="text-[#1F4D36] md:flex justify-between h-screen overflow-y-hidden">
      <LeftContainer />
      <VerifyEmail userEmail={userEmail} />
    </div>
  );
}
