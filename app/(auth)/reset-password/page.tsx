import ResetPassword from "@/app/components/auth-components/ResetPassword";
import LeftContainer from "@/app/components/auth-components/leftContainer";

export default async function ResetPasswordPage({ searchParams }: { searchParams: any }) {
  const resetPasswordToken = searchParams?.resetToken;
  return (
    <div className="text-[#1F4D36] md:flex justify-between h-screen overflow-y-hidden">
      <LeftContainer />
      <ResetPassword token={resetPasswordToken} />
    </div>
  );
}
