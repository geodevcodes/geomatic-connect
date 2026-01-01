"use client";
import SubscribeModal from "@/app/components/student-components/SubscribeModal";
import ReactSelect from "@/app/components/inputs/ReactSelect";
import { institutionData, stateData } from "@/utils/FilterData";
import {
  useGetUserProfileRequest,
  useUpdateUserProfile,
} from "@/app/services/users.request";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderCircle, Upload } from "lucide-react";
import { Modal } from "@/app/components/modals/Modal";
import { toast } from "sonner";

interface SettingsProps {
  userId: string;
}

const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full Name is required")
    .min(3, "Full Name must be greater than 3 letters"),
  aboutMe: yup
    .string()
    .required("About is required")
    .min(3, "About must be greater than 50 words"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email format"),
  mobileNumber: yup
    .number()
    .required("Mobile is required")
    .min(3, " must be greater than 8 letters"),
  institutionName: yup
    .string()
    .required("Institution is required")
    .min(3, " must be greater than 10 letters"),
  state: yup.string().required("State is required"),
});

export default function Settings({ userId }: SettingsProps) {
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [userDocument, setUserDocument] = useState<string | undefined>(
    undefined
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const { data: userProfileData } = useGetUserProfileRequest(userId as string);
  const { mutate: updateUserRequest, isPending } = useUpdateUserProfile();

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
  const stateValue = watch("state");

  // Default values when userProfileData is available
  useEffect(() => {
    if (userProfileData) {
      setValue("fullName", userProfileData.data.fullName);
      setValue("aboutMe", userProfileData.data.aboutMe);
      setValue("email", userProfileData.data.email);
      setValue("mobileNumber", userProfileData.data.phoneNumber);
      setValue("institutionName", userProfileData.data.institutionName);
      setValue("state", userProfileData.data.state);
    }
  }, [userProfileData, setValue]);

  // Uploading avatar(profile image) logic
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const isValidFileType = (type: string) =>
      ["image/jpg", "image/png", "image/jpeg", "image/webp"].includes(type);

    if (files && files[0]) {
      const file = files[0];
      if (isValidFileType(file.type)) {
        setUserImage(URL.createObjectURL(files[0]));
        setSelectedFile(file);
      } else {
        toast.error(
          "Unsupported file type. Please upload a JPG, PNG, WEBP or JPEG"
        );
      }
    }
  };

  // Uploading document logic
  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const isValidFileType = (type: string) =>
      [
        "image/jpg",
        "image/png",
        "image/jpeg",
        "image/webp",
        "application/pdf",
      ].includes(type);
    if (files && files[0]) {
      const file = files[0];
      if (isValidFileType(file.type)) {
        setUserDocument(URL.createObjectURL(file));
        setSelectedDocument(file);
      } else {
        toast.error(
          "Unsupported file type. Please upload a JPG, PNG, JPEG, or PDF."
        );
      }
    }
  };

  // Submit handler for the form
  const onSubmitHandler = async (data: any) => {
    const formData = new FormData();
    formData.append("fullName", data?.fullName);
    formData.append("aboutMe", data.aboutMe);
    formData.append("email", data?.email);
    formData.append("phoneNumber", data?.mobileNumber);
    formData.append("state", data?.state);
    formData.append("institutionName", data?.institutionName);

    // Only append files if they are selected
    if (selectedFile) {
      formData.append("avatarImage", selectedFile);
    }
    if (selectedDocument) {
      formData.append("documentFile", selectedDocument);
    }

    updateUserRequest(
      { userId, formData },
      {
        onSuccess: () => {
          console.log("profile updated successfully");
        },
        onError: () => {
          console.log("error updating user profile");
        },
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="lg:grid grid-cols-2 md:gap-16 xl:gap-24 max-w-[1400px]">
          <div>
            {/* ====Full Name === */}
            <div>
              <label htmlFor="name">
                <span className="text-sm font-medium">Full Name</span>
                <input
                  type="text"
                  placeholder="Full name"
                  {...register("fullName")}
                  className={`${
                    errors.fullName && "border-[1.3px] border-red-500"
                  } w-full border border-slate rounded-sm p-3 focus:outline-none mt-1 text-sm`}
                />
              </label>
            </div>
            {/* ====Email === */}
            <div className="mt-3">
              <label htmlFor="email">
                <span className="text-sm font-medium">Email</span>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  disabled
                  className={`${
                    errors.email && "border-[1.3px] border-red-500"
                  } w-full border border-slate rounded-sm p-3 focus:outline-none mt-1 text-sm text-muted-foreground cursor-not-allowed`}
                />
              </label>
            </div>
            {/* ====Phone Number === */}
            <div className="mt-3">
              <label htmlFor="mobileNumber">
                <span className="text-sm font-medium">Mobile Number</span>
                <input
                  type="number"
                  {...register("mobileNumber")}
                  placeholder="(+234) 81 3364 ****"
                  className="w-full border border-slate rounded-sm p-3 focus:outline-none mt-1 text-sm"
                />
              </label>
            </div>
            {/* === Institution Dropdown Input === */}
            <div className="mt-3">
              <label htmlFor="institutionName" className="text-sm font-medium">
                Institution
              </label>
              <div
                className={`${
                  errors.institutionName ? "border-[1.3px] border-red-500" : ""
                } flex flex-col w-full`}
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
                />
              </div>
            </div>
            {/* ====About Me === */}
            <div className="mt-3">
              <span className="text-sm font-medium">About Me</span>
              <div
                className={`${
                  errors.aboutMe ? "border-[1.3px] border-red-500" : ""
                } flex flex-col w-full pt-2 px-4 pb-1 border border-slate mt-1`}
              >
                <textarea
                  className="py-2 focus:outline-none placeholder:text-sm cursor-text custom-placeholder bg-transparent text-sm leading-8"
                  placeholder="Description"
                  rows={8}
                  cols={60}
                  {...register("aboutMe")}
                />
              </div>
            </div>
          </div>
          <div>
            {/* === State Dropdown Input === */}
            <section>
              <label htmlFor="state" className="text-sm font-medium">
                Your Location
              </label>
              <div
                className={`${
                  errors.state ? "border-[1.3px] border-red-500" : ""
                } flex flex-col w-full`}
              >
                <ReactSelect
                  options={stateData}
                  placeholder="Your Location"
                  value={stateData.find(
                    (option) => option.value === stateValue
                  )}
                  onChange={(option: any) => {
                    setValue("state", option?.value || "");
                    trigger("state"); // Trigger validation
                  }}
                />
              </div>
            </section>
            {/* =====Profile Picture ===== */}
            <section>
              <div className="border-[0.5px] border-slate-300 dark:border-muted px-4 pt-3 pb-6 md:px-10 md:pt-6 md:pb-6 rounded-xl bg-white dark:bg-background max-w-[540px] mt-6">
                <p className="text-sm font-medium">Profile picture</p>
                <div className="flex items-center justify-center space-x-2 md:space-x-6 bg-white dark:bg-background rounded-2xl  border-[0.6px] border-slate-300 dark:border-muted mt-4 cursor-pointer">
                  <label
                    htmlFor="avatarInput"
                    className="w-full p-3 flex  justify-between tracking-wide cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <p className="w-full text-center">Upload image</p>
                      <input
                        type="file"
                        name="user_Image"
                        id="avatarInput"
                        accept=".png,  .jpg, .jpeg, webp"
                        className="hidden input-field"
                        onChange={handleFileChange}
                      />

                      {userImage || userProfileData?.data?.avatarImage ? (
                        <div className="border-2 border-slate-800 rounded-full relative mx-auto w-[45px]">
                          <Image
                            src={
                              userImage || userProfileData?.data?.avatarImage
                            }
                            alt="user avatar"
                            width={100}
                            height={100}
                            className="rounded-full w-[45px] h-[35px]"
                          />
                        </div>
                      ) : (
                        <div className="border-slate-800 border-[1.3px] border-dashed rounded-full relative mx-auto flex items-center justify-center w-[45px] h-[45px]">
                          <Upload
                            size={24}
                            className="rounded-full w-[45px] h-[24px]"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* =====Documents  ===== */}
            <section>
              <div className="border-[0.5px] border-slate-300 dark:border-muted px-4 pt-3 pb-6 md:px-10 md:pt-6 md:pb-6 rounded-xl bg-white dark:bg-background max-w-[540px] mt-6">
                <p className="text-sm font-medium">
                  Documents(CV / SIWES Letter /IT Letter/ Professional Letter)
                </p>
                <div className="flex items-center justify-center space-x-2 md:space-x-6 bg-white dark:bg-background rounded-2xl  border-[0.6px] border-slate-300 dark:border-muted mt-4 cursor-pointer">
                  <label
                    htmlFor="documentInput"
                    className="w-full p-3 flex  justify-between tracking-wide cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <p className="w-full text-center flex items-center gap-6 justify-center">
                        Upload docs{" "}
                        <Upload
                          size={18}
                          className="rounded-full w-[32px] h-[18px]"
                        />
                      </p>
                      <input
                        type="file"
                        name="document_Image"
                        id="documentInput"
                        accept=".pdf, .doc, .docx"
                        className="hidden input-field"
                        onChange={handleDocumentChange}
                      />
                    </div>
                  </label>
                </div>
                <p className="text-xs text-[#33A852] truncate">
                  {selectedDocument?.name}
                </p>
                <a
                  href={userProfileData?.data?.documentFile || "#"}
                  onClick={(e) => {
                    if (!userProfileData?.data?.documentFile) {
                      e.preventDefault();
                      toast.error(
                        "No available document, Kindly please upload your file"
                      );
                    }
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="font-semibold mt-2 w-full text-right inline-block text-[#33A852] underline"
                >
                  View Document
                </a>
              </div>
            </section>
          </div>
        </div>

        <div>
          <button
            disabled={isPending}
            className=" mt-6 rounded-md  px-3.5 py-2 font-light text-white shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045]  cursor-pointer"
          >
            {isPending ? (
              <span className="flex space-x-4 gap-3">
                <LoaderCircle className="animate-spin" /> Updating...
              </span>
            ) : (
              "Save Now"
            )}
          </button>
        </div>
      </form>

      <Modal show={showSubscribe} onClose={() => setShowSubscribe(false)}>
        <SubscribeModal setShowSubscribe={setShowSubscribe} />
      </Modal>
    </>
  );
}
