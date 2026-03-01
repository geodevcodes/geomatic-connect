import ForgotPassword from "@/app/components/auth-components/ForgotPassword";
import LeftContainer from "@/app/components/auth-components/leftContainer";

export default async function ForgotPasswordPage() {
  return (
    <div className="text-[#1F4D36] md:flex justify-between h-screen overflow-y-hidden">
      <LeftContainer />
      <ForgotPassword />
    </div>
  );
}
