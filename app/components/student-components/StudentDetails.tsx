"use client";
import { useState } from "react";
import Map from "@/app/components/map/Map";
import { MdOutlineStar } from "react-icons/md";
import { Sheet } from "@/app/components/sheets/Sheet";
import SendRequest from "./SendRequest";
import { useGetUserByIdRequest } from "@/app/services/request.request";
import { useGetUserProfileRequest } from "@/app/services/users.request";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface StudentDetailsProps {
  companyId?: any;
  session: any;
}

export default function StudentDetails({
  companyId,
  session,
}: StudentDetailsProps) {
  const userId = session?.user?._id;
  const token = session?.user.token;
  const [showSendRequest, setShowSendRequest] = useState(false);
  const { data: userData } = useGetUserByIdRequest(companyId);
  const { data: userProfileData } = useGetUserProfileRequest(userId as string);
  const router = useRouter();

  return (
    <>
      <div className="mt-24 mb-10 items-center justify-between bg-[#ECF1F7] dark:bg-muted flex p-2 gap-3  lg:my-20 xl:my-10">
        <div className="flex items-center">
          <p
            onClick={() => router.back()}
            className="py-2 cursor-pointer text-base md:text-xl font-bold text-gray-400"
          >
            Home
          </p>
          <ChevronRight size={24} className="mx-0.5" />
          <p className="py-2 cursor-text text-base  md:text-xl font-bold">
            Profile
          </p>
        </div>

        <div>
          <p
            onClick={() => setShowSendRequest(true)}
            className="relative group cursor-pointer rounded-md border p-3 w-[170px] text-center text-white bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:bg-muted dark:bg-gradient-to-r dark:from-muted-foreground dark:to-muted"
          >
            <span className="flex items-center gap-4 justify-center relative">
              Send Request
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </p>
        </div>
      </div>
      {/* ================Body section ===========  */}
      <section className="mt-8">
        <div>
          <section>
            <div className="flex flex-col-reverse md:grid grid-cols-2 md:gap-4">
              <div className="w-full h-full rounded-md">
                <Map companyAddress={userData?.data?.companyAddress} />
              </div>
              <div>
                <div className="grid grid-cols-2">
                  <div className="mb-4 leading-8 font-light">
                    <p className="text-lg font-bold mb-2">
                      Specialized Field:{" "}
                    </p>
                    <p className="dark:text-muted-foreground">
                      Cadastral Surveying
                    </p>
                    <p className="dark:text-muted-foreground">
                      Topographical Surveying
                    </p>
                    <p className="dark:text-muted-foreground">
                      Drone Surveying
                    </p>
                    <p className="dark:text-muted-foreground">
                      Hydrograhical Surveying
                    </p>
                    <p className="dark:text-muted-foreground">
                      GIS & Remote Sensing
                    </p>
                  </div>
                  <div className="mb-4 ">
                    <p className="text-lg font-bold mb-2">Rating: </p>
                    <div className="space-y-2">
                      <p className="flex">
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-yellow-400" />
                      </p>
                      <p className="flex">
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-slate-400" />
                      </p>
                      <p className="flex">
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-slate-400" />
                      </p>
                      <p className="flex">
                        <MdOutlineStar size={24} className="text-yellow-400" />
                        <MdOutlineStar size={24} className="text-slate-400" />
                      </p>
                      <p className="flex">
                        <MdOutlineStar size={24} className="text-yellow-400" />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 font-sans text-md">
                  <p className="text-lg font-bold">Goals:</p>
                  <p className="leading-8 font-light dark:text-muted-foreground">
                    {userData?.data?.aboutMe}
                  </p>
                </div>

                <div className="mt-4 font-sans text-md">
                  <p className="text-lg font-bold">Address: </p>
                  <p className="leading-8 font-light dark:text-muted-foreground">
                    {userData?.data?.companyAddress}
                  </p>
                </div>

                <div className="mt-8 font-sans text-md flex gap-4 items-center">
                  <p className="text-lg font-bold">Accomodation: </p>
                  <p className="leading-8 font-light dark:text-muted-foreground">
                    {userData?.data?.accomodation === true ? "Yes" : "No"}
                  </p>
                </div>

                <div className="mt-8 font-sans text-md">
                  <p className="text-lg font-bold">Achievement: </p>
                  <p className="leading-8 font-light dark:text-muted-foreground">
                    13 Olaide Tomori St, Ikeja, 101233, Lagos
                  </p>
                </div>

                <div className="mt-6 mb-10">
                  <p
                    onClick={() => setShowSendRequest(true)}
                    className="relative group cursor-pointer rounded-md border p-3 w-[170px]  text-center text-white bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:bg-muted dark:bg-gradient-to-r dark:from-muted-foreground dark:to-muted"
                  >
                    <span className="flex items-center gap-4 justify-center relative">
                      Send Request
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* ===Sheets */}
      <Sheet show={showSendRequest} onClose={() => setShowSendRequest(false)}>
        <SendRequest
          setShowSendRequest={setShowSendRequest}
          companyId={companyId}
          userData={userProfileData}
        />
      </Sheet>
    </>
  );
}
