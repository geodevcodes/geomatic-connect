import { useStudentSendRequestToAdmin } from "@/app/services/request.request";
import ReactSelect from "@/app/components/inputs/ReactSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { toast } from "sonner";
import SuccessMessage from "./SuccessMessage";
import {
  institutionData,
  purposeOfRequestData,
  educationLevelData,
} from "@/utils/FilterData";
import { useRouter } from "next/navigation";
import ReactConfetti from "react-confetti";

interface SendRequestProps {
  setShowSendRequest?: any;
  userData: any;
  companyId?: any;
  selectedCompanyId?: any;
}

// Validation Schema
const schema = yup.object().shape({
  educationLevel: yup
    .string()
    .required("Track Period is required")
    .min(3, "Track Period must be greater than 3 letters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email format"),
  institutionName: yup
    .string()
    .required("Institution is required")
    .min(3, " must be greater than 10 letters"),
  requestPurpose: yup
    .string()
    .required("Request Purpose is required")
    .min(3, " must be greater than 10 letters"),
  backgroundHistory: yup
    .string()
    .required("Description is required")
    .min(3, " must be greater than 10 letters"),
});

export default function SendRequest({
  setShowSendRequest,
  userData,
  companyId,
  selectedCompanyId,
}: SendRequestProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const { mutate: studentSendRequestToAdmin } = useStudentSendRequestToAdmin();
  const [responseData, setResponseData] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // REACT HOOK FORM LOGIC
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({ resolver: yupResolver(schema) });

  const institutionNameValue = watch("institutionName");

  // Default values when userData is available
  useEffect(() => {
    if (userData) {
      setValue("institutionName", userData?.data?.institutionName);
    }
  }, [userData, setValue]);

  // Send Request submission Logic
  const onSubmitHandler = async (data: any) => {
    if (!userData?.data?.institutionName) {
      toast.error(
        "Hold on! You need to complete your profile before you can make a request."
      );
      setTimeout(async () => {
        if (!userData?.data?.institutionName) {
          router.push("/student-dashboard/settings");
        }
      }, 5000);
      return;
    }
    setIsSaving(true);
    const payload = {
      studentId: userData?.data?._id,
      companyId: companyId ? companyId : selectedCompanyId,
      email: data?.email,
      institutionName: data?.institutionName,
      educationLevel: data?.educationLevel,
      requestPurpose: data?.requestPurpose,
      backgroundHistory: data?.backgroundHistory,
    };
    studentSendRequestToAdmin(
      payload,
      {
        onSuccess: (data) => {
          setResponseData(data);
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSendRequest(false);
          }, 5000);
        },
        onError: () => {
          console.log("error creating request");
        },
      }
    );
  };

  return (
    <div>
      {showSuccessMessage === false ? (
        <div className="w-full pt-1 md:pt-10 md:pb-20">
          <div>
            <div className="text-primary mb-8  flex items-center justify-between border-b border-slate-300 dark:border-muted pb-8">
              <p className="text-xl text-[#33A852] dark:text-secondary-foreground">
                Make a Request
              </p>
              <button
                onClick={() => setShowSendRequest(false)}
                className="rounded-md gap-6 hover:bg-slate-100 dark:hover:bg-muted p-2 cursor-pointer"
              >
                <X className="text-[#33A852] dark:text-secondary-foreground" />
              </button>
            </div>
          </div>

          {/* ===FORM SECTION === */}
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <section className="items-start space-y-6">
              {/* === Email Input === */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm text-gray-500 dark:text-muted-foreground font-normal"
                >
                  Email Address
                </label>
                <div
                  className={`${
                    errors.email
                      ? "border-[1.3px] border-red-500"
                      : "border-[1.3px] border-slate-300 dark:border dark:border-muted-foreground"
                  } flex flex-col w-full pt-2 px-4 pb-1 bg-gray-100 dark:bg-background`}
                >
                  <input
                    className="py-2 focus:outline-none placeholder:text-sm custom-placeholder bg-transparent text-black dark:text-muted-foreground cursor-not-allowed"
                    type="email"
                    readOnly={true}
                    placeholder="Email Address"
                    {...register("email")}
                    maxLength={40}
                    value={userData?.data?.email}
                  />
                </div>
              </div>
              {/* === Institution Dropdown Input === */}
              <div>
                <label
                  htmlFor="institutionName"
                  className="text-sm text-gray-500 dark:text-muted-foreground font-normal"
                >
                  Institution
                </label>
                <div
                  className={`${
                    errors.institutionName
                      ? "border-[1.3px] border-red-500"
                      : ""
                  } ${!!userData?.data?.institutionName ? "cursor-not-allowed" : "cursor-pointer"} flex flex-col w-full`}
                >
                  <ReactSelect
                    options={institutionData}
                    placeholder="Institution name"
                    value={institutionData.find(
                      (option) => option.value === institutionNameValue
                    )}
                    onChange={(option: any) => {
                      setValue("institutionName", option?.value || "");
                      trigger("institutionName"); // Trigger validation
                    }}
                    isDisabled={!!userData?.data?.institutionName}
                  />
                </div>
              </div>
              {/* === Level of Education === */}
              <div>
                <label
                  htmlFor="educationLevel"
                  className="text-sm text-gray-500 dark:text-muted-foreground font-normal"
                >
                  Level of Education
                </label>
                <div
                  className={`${
                    errors.educationLevel ? "border-[1.3px] border-red-500" : ""
                  } flex flex-col w-full`}
                >
                  <ReactSelect
                    options={educationLevelData}
                    placeholder="Edu. Level"
                    onChange={(option: any) => {
                      setValue("educationLevel", option?.value || "");
                      trigger("educationLevel"); // Trigger validation
                    }}
                  />
                </div>
              </div>
              {/* === (Purpose of Request) Training Input === */}
              <div>
                <label
                  htmlFor="requestPurpose"
                  className="text-sm text-gray-500 dark:text-muted-foreground font-normal"
                >
                  Purpose of Request
                </label>
                <div
                  className={`${
                    errors.requestPurpose ? "border-[1.3px] border-red-500" : ""
                  } flex flex-col w-full`}
                >
                  <ReactSelect
                    options={purposeOfRequestData}
                    placeholder="Purpose of Request"
                    onChange={(option: any) => {
                      setValue("requestPurpose", option?.value || "");
                      trigger("requestPurpose"); // Trigger validation
                    }}
                  />
                </div>
              </div>
              {/* === Description Input === */}
              <div>
                <label
                  htmlFor="backgroundHistory"
                  className="text-sm text-gray-500 dark:text-muted-foreground font-normal"
                >
                  Cover Letter
                </label>
                <div
                  className={`${
                    errors.backgroundHistory
                      ? "border-[1.3px] border-red-500"
                      : "border-[1.3px] border-slate-300 dark:border dark:border-muted-foreground"
                  } flex flex-col w-full pt-2 px-4 pb-1 dark:bg-background`}
                >
                  <textarea
                    className="py-2 focus:outline-none placeholder:text-sm cursor-text custom-placeholder bg-transparent text-gray-900 dark:text-white"
                    placeholder="Description...."
                    {...register("backgroundHistory")}
                    rows={4}
                    cols={40}
                  />
                </div>
              </div>
            </section>

            {/* === Submit Button === */}
            <button
              disabled={isSaving}
              className="relative group cursor-pointer w-full mt-10 px-3.5 py-4 font-light text-white shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:bg-muted dark:bg-gradient-to-r dark:from-muted dark:to-muted"
            >
              <span className="text-base flex items-center gap-4 justify-center relative">
                {isSaving ? "Submitting...." : "Submit Request"}
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </form>
        </div>
      ) : (
        <>
          <SuccessMessage setShowSendRequest={setShowSendRequest} />
          <ReactConfetti
            gravity={0.1}
            height={738}
            initialVelocityX={2}
            initialVelocityY={2}
            numberOfPieces={200}
            opacity={1}
            recycle
            run
            width={2560}
            wind={0}
          />
        </>
      )}
    </div>
  );
}
