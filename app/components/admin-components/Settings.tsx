"use client";
import {
  useGetUserProfileRequest,
  useUpdateUserProfile,
} from "@/app/services/users.request";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { LoaderCircle, Plus, Upload } from "lucide-react";
import { Sheet } from "@/app/components/sheets/Sheet";
import AddTeamMate from "./AddTeamMate";

interface SettingsProps {
  userId: string;
}

const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full Name is required")
    .min(3, "Full Name must be greater than 3 letters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email format"),
  mobileNumber: yup
    .number()
    .required("Mobile is required")
    .min(3, " must be greater than 8 letters"),
});

export default function Settings({ userId }: SettingsProps) {
  const [showAddTeamMate, setShowAddTeamMate] = useState(false);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const { data: userProfileData } = useGetUserProfileRequest(userId as string);
  const { mutate: updateUserRequest, isPending } = useUpdateUserProfile();

  // REACT HOOK FORM LOGIC
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  // Default values when userProfileData is available
  useEffect(() => {
    if (userProfileData) {
      setValue("fullName", userProfileData.data.fullName);
      setValue("email", userProfileData.data.email);
      setValue("mobileNumber", userProfileData.data.phoneNumber);
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

  // Submit handler for the form
  const onSubmitHandler = async (data: any) => {
    const formData = new FormData();
    formData.append("fullName", data?.fullName);
    formData.append("email", data?.email);
    formData.append("phoneNumber", data?.mobileNumber);

    // Only append files if they are selected
    if (selectedFile) {
      formData.append("avatarImage", selectedFile);
    }
    if (selectedDocument) {
      formData.append("documentFile", selectedDocument);
    }
    const payload = { formData };

    updateUserRequest(
      { userId, payload },
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
      <div className="md:flex items-center md:space-x-4">
        <div className="w-full font-sans text-md ">
          <p className="text-2xl font-bold mb-2">Profile</p>
          <p className="text-gray-500">Manage the settings of your account</p>
        </div>
        <div
          onClick={() => setShowAddTeamMate(true)}
          className="my-4 flex p-2 md:p-3 justify-center items-center gap-[8px] rounded-[8px] text-white w-full md:w-[200px] lg:w-[200px] cursor-pointer  px-3.5 py-4 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:bg-muted dark:bg-gradient-to-r dark:from-muted dark:to-muted-foreground"
        >
          <p className="text-[#FFFFFF] text-sm md:text-md">Invite Team Mate</p>
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
      <section className="h-fit border mt-8 p-6 rounded-md">
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          {/* ====Full Name === */}
          <div>
            <label htmlFor="name">
              <span className="text-sm font-medium">Administration Name</span>
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
          {/* ====Phon Number === */}
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
                      accept=".png,  .jpg, .jpeg, .webp"
                      className="hidden input-field"
                      onChange={handleFileChange}
                    />

                    {userImage || userProfileData?.data?.avatarImage ? (
                      <div className="border-2 border-slate-800 rounded-full relative mx-auto w-[45px]">
                        <Image
                          src={userImage || userProfileData?.data?.avatarImage}
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

          <div className="">
            <button
              disabled={isPending}
              className=" mt-6 rounded-md cursor-pointer px-3.5 py-2 font-light text-white shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:bg-muted dark:bg-gradient-to-r dark:from-muted dark:to-muted-foreground"
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
      </section>

      {/*============ SHEETS ============ */}
      {/* === Add TeamMate === */}
      <Sheet show={showAddTeamMate} onClose={() => setShowAddTeamMate(false)}>
        <AddTeamMate setShowAddTeamMate={setShowAddTeamMate} />
      </Sheet>
    </>
  );
}
