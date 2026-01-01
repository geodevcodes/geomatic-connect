import { useAdminSendRequestToCompany } from "@/app/services/request.request";
import SuccessMessage from "../company-components/SuccessMessage";
import { CircleUserRound, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface RequestDetailsProps {
  setShowSendRequest?: any;
  notificationsData?: any;
  notificationID?: any;
  setShowConfirmApprove?: any;
  setShowConfirmDecline?: any;
}

export default function RequestDetails({
  setShowSendRequest,
  notificationsData,
  notificationID,
  setShowConfirmApprove,
  setShowConfirmDecline,
}: RequestDetailsProps) {
  const [isForwarding, setIsForwarding] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<any[]>([]);
  const { mutate: adminSendRequestToCompany } = useAdminSendRequestToCompany();

  const notificationArray = notificationsData || [];
  const notification = notificationArray?.find(
    (notification: any) => notification?._id === notificationID
  );

  // Forward Request to Company submission Logic
  const handleForwardRequest = async () => {
    setIsForwarding(true);
    const payload = {
      requestId: notification?._id,
    };
    adminSendRequestToCompany(
      {
        payload,
      },
      {
        onSuccess: (data) => {
          setResponseData(data);
          setShowSendRequest(false);
          setIsForwarding(false);
        },
        onError: () => {
          console.log("error creating request");
          setIsForwarding(false);
        },
      }
    );
  };

  return (
    <div>
      {showSuccessMessage === false ? (
        <div className="bg-[#FFFFFF] max-w-[350px] md:max-w-none  lg:w-full p-6  md:pt-10 md:pb-16 md:p-10">
          <div>
            <div className="mb-8 flex items-center justify-between border-b border-slate-300 pb-8">
              <p className="text-base md:text-xl">Forward a Request</p>

              <button
                onClick={() => setShowSendRequest(false)}
                className="rounded-md gap-6 hover:bg-slate-100 p-2"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <div className="my-10 rounded-md px-2 md:px-6 py-6 bg-gray-100 flex justify-between">
            <div>
              <p className="font-bold text-center text-sm md:text-left">
                {notification?.studentId?.fullName}
              </p>
              <div className="items-center flex flex-col justify-center md:flex-row md:flex md:items-center md:justify-start mt-6 max-w-[400px]">
                {notification?.studentId?.avatarImage ? (
                  <div className="relative rounded-full mr-10 w-[100px] h-[100px] flex items-center justify-center">
                    <Image
                      src={notification?.studentId?.avatarImage}
                      fill
                      alt="user avatar"
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="mb-4  mr-0 w-[90px] h-[100px] md:h-[100px] md:w-[100px] md:mb-0 md:mr-6">
                    <CircleUserRound className="size-28 dark:text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <a
                href={notification?.studentId?.documentFile || "#"}
                onClick={(e) => {
                  if (!notification?.studentId?.documentFile) {
                    e.preventDefault();
                    toast.error("No available document");
                  }
                }}
                rel="noopener noreferrer"
                target="_blank"
                className="font-semibold text-sm text-right mt-2 inline-block text-[#33A852] underline"
              >
                View Document
              </a>
              <button
                disabled={isForwarding}
                onClick={() => handleForwardRequest()}
                className="w-full px-2 py-2 md:px-3.5 md:py-4 font-light text-white shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045]  cursor-pointer rounded-sm"
              >
                <span className="text-sm md:text-base">
                  {isForwarding ? "Forwarding...." : "Forward Request"}
                </span>
              </button>
            </div>
          </div>

          <section className="items-start space-y-6">
            <section className="md:grid md:grid-cols-2 gap-3">
              {/* === Full Name === */}
              <div>
                <span className="text-sm text-gray-500 font-normal">
                  Full Name
                </span>
                <div className="flex flex-col w-full pt-2 px-4 pb-1 rounded-md bg-gray-100 border-[1.3px] border-slate-300">
                  <p className="py-2 focus:outline-none placeholder:text-sm custom-placeholder bg-transparent text-black">
                    {notification?.studentId?.fullName}
                  </p>
                </div>
              </div>
              {/* === Email Address === */}
              <div>
                <span className="text-sm text-gray-500 font-normal">Email</span>
                <div className="flex flex-col w-full pt-2 px-4 pb-1 rounded-md bg-gray-100 border-[1.3px] border-slate-300">
                  <p className="py-2 focus:outline-none placeholder:text-sm custom-placeholder bg-transparent text-black">
                    {notification?.email}
                  </p>
                </div>
              </div>
            </section>

            <section className="md:grid md:grid-cols-2 gap-3">
              {/* === Institution Name === */}
              <div>
                <span className="text-sm text-gray-500 font-normal">
                  Institution Attended
                </span>
                <div className="flex flex-col w-full pt-2 px-4 pb-1 rounded-md bg-gray-100 border-[1.3px] border-slate-300">
                  <p className="py-2 focus:outline-none placeholder:text-sm custom-placeholder bg-transparent text-black">
                    {notification?.institutionName}
                  </p>
                </div>
              </div>

              {/* === Level of Education === */}
              <div>
                <span className="text-sm text-gray-500 font-normal">
                  Level of Education
                </span>
                <div className="flex flex-col w-full pt-2 px-4 pb-1 rounded-md bg-gray-100 border-[1.3px] border-slate-300">
                  <p className="py-2 focus:outline-none placeholder:text-sm custom-placeholder bg-transparent text-black">
                    {notification?.educationLevel}
                  </p>
                </div>
              </div>
            </section>
            {/* === (Purpose of Request) Training   === */}
            <div>
              <span className="text-sm text-gray-500 font-normal">
                Purpose of Request
              </span>
              <div className="flex flex-col w-full pt-2 px-4 pb-1 rounded-md bg-gray-100 border-[1.3px] border-slate-300">
                <p className="py-2 focus:outline-none placeholder:text-sm custom-placeholder bg-transparent text-black">
                  {notification?.requestPurpose}
                </p>
              </div>
            </div>

            {/* === Description  === */}
            <div>
              <span className="text-sm text-gray-500 font-normal">
                Description Info.
              </span>
              <div className="bg-gray-100 flex flex-col w-full pt-2 px-4 pb-1 rounded-md border-[1.3px] border-slate-300">
                <textarea
                  className="py-2 focus:outline-none placeholder:text-sm cursor-text custom-placeholder text-black bg-gray-100"
                  placeholder="Description"
                  rows={8}
                  cols={60}
                  value={notification?.backgroundHistory}
                />
              </div>
            </div>
          </section>

          {/* === Submit Button === */}
          <div className="flex justify-between gap-6">
            <button
              onClick={() => setShowConfirmApprove(true)}
              disabled={
                notification?.status !== "Interested" &&
                notification?.status !== "Approved"
              }
              className={`${
                notification?.status !== "Interested" &&
                notification?.status !== "Approved"
                  ? "cursor-not-allowed disabled:opacity-50"
                  : "cursor-pointer"
              } w-full mt-10 px-1 py-2 md:px-3.5 md:py-4 font-light text-white shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] rounded-sm`}
            >
              <span className="text-sm md:text-base">Approve Request</span>
            </button>
            <button
              onClick={() => setShowConfirmDecline(true)}
              className="w-full mt-10 px-1.5 py-2 md:px-3.5 md:py-4 font-light text-white shadow-sm bg-gradient-to-r from-[#D92D20] to-[#F97316] rounded-sm"
            >
              <span className="text-sm md:text-base">Decline Request</span>
            </button>
          </div>
        </div>
      ) : (
        <SuccessMessage
          setShowSendRequest={setShowSendRequest}
          responseData={responseData}
        />
      )}
    </div>
  );
}
