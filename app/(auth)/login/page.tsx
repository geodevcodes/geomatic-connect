import LeftContainer from "@/app/components/auth-components/leftContainer";
import LoginHome from "@/app/components/auth-components/LoginHome";


export default async function Login() {
  return (
    <div className="text-[#1F4D36] md:flex justify-between h-screen overflow-y-hidden">
      <LeftContainer />
      <LoginHome />
    </div>
  );
}
