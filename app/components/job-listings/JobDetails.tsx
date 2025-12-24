"use client";
import {
  useApplyToJobRequest,
  useGetJobRequest,
} from "@/app/services/job.request";
import { Facebook, Linkedin, LoaderCircle, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RiTwitterXFill } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { getShortTitle } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { IoIosLink } from "react-icons/io";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface JobDetailsProps {
  jobId: string;
}
export default function JobDetails({ jobId }: JobDetailsProps) {
  const [showActions, setShowActions] = useState(false);
  const shareRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = session?.user?._id as string;
  const { data: jobData, isLoading } = useGetJobRequest(jobId as string);
  const { mutate: applyToJob, isPending } = useApplyToJobRequest();

  // Share dropdown Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const shareText = jobData?.data?.jobTitle
    ? getShortTitle(jobData.data.jobTitle)
    : "Geomatic Connect Job";

  const cleanPath = pathname.replace(/^\/admin-dashboard/, "");
  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}${cleanPath}`;
  const encodedUrl = encodeURIComponent(fullUrl);

  // Apply To Job handler
  const applyToJobHandler = async () => {
    applyToJob(
      {
        jobId,
      },
      {
        onSuccess: () => {
          console.log("applied to job successfully");
        },
        onError: () => {
          console.log("error applying to job");
        },
      }
    );
  };

  const hasApplied = jobData?.data?.applicants?.some(
    (applicant: any) => applicant?.user?._id === userId
  );

  return (
    <>
      {isLoading ? (
        <div className="pt-[80px] pb-[150px]">
          <LoaderCircle className="size-12 animate-spin duration-500 mx-auto mt-8" />
        </div>
      ) : (
        <div className="max-w-3xl min-h-[100vh] p-4 overflow-hidden border border-slate-300 dark:border-muted rounded-lg">
          <header className="border-b border-slate-300 dark:border-muted pb-8">
            {jobData?.data?.companyId?.avatarImage ? (
              <Image
                src={jobData.data.companyId.avatarImage}
                alt="company brand logo"
                width={100}
                height={100}
                className="w-[70px] h-[70px] border-[1.3px] border-slate-200 dark:border-muted items-center justify-center flex rounded-lg object-cover"
              />
            ) : (
              <div className="w-[70px] h-[70px] border-[1.3px] border-slate-200 dark:border-muted items-center justify-center flex rounded-lg bg-gray-100 dark:text-muted-foreground text-sm text-gray-500">
                No Image
              </div>
            )}
            <h3 className="font-bold text-xl md:text-3xl">
              {jobData?.data?.jobTitle}
            </h3>
            <span className="text-base">at</span>
            <span className="text-muted-foreground ml-2 text-base">
              {jobData?.data?.companyId?.companyName}
            </span>
            <p className="flex items-center flex-wrap gap-2 mt-2 text-base text-muted-foreground">
              <span className="font-semibold text-black/80 dark:text-muted-foreground">
                {jobData?.data?.jobType}
              </span>
              <span>. {jobData?.data?.location}</span>
              <span>. {jobData?.data?.experienceLevel}</span>
            </p>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center justify-between">
              <p className="text-sm text-muted-foreground">Posted 4 days ago</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowActions((prevState) => !prevState)}
                  className="relative cursor-pointer w-full md:w-fit"
                >
                  <span className="px-3.5 py-2 flex items-center justify-center cursor-pointer gap-2 border text-sm border-slate-300 dark:border-muted bg-white dark:bg-muted rounded-sm">
                    <Share2 className="size-4" />
                    Share
                  </span>
                  <span
                    ref={shareRef}
                    className={`${
                      showActions ? "block" : "hidden"
                    } bg-white dark:bg-background py-3 px-2 shadow-md rounded-lg text-sm border border-[#213f7d0f] dark:border-muted w-[200px] space-y-2 absolute -right-16 lg:right-[-18px] z-[1] top-[50px]`}
                  >
                    <Link
                      href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
                      className="rounded-xl hover:bg-gray-100 dark:hover:bg-accent hover:text-[#014751] text-gray-600 dark:text-muted-foreground flex items-center gap-x-2 cursor-pointer p-2 pl-3  w-full"
                    >
                      <RiTwitterXFill size={18} />
                      Share on X
                    </Link>
                    <Link
                      href={`https://www.linkedin.com/feed/?shareActive=true&shareUrl=${encodedUrl}`}
                      className="rounded-xl hover:bg-gray-100 dark:hover:bg-accent hover:text-[#014751] text-gray-600 dark:text-muted-foreground flex items-center gap-x-2 cursor-pointer p-2 pl-3 w-full"
                    >
                      <Linkedin size={18} />
                      Share on LinkedIn
                    </Link>
                    <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                      className="rounded-xl hover:bg-gray-100 dark:hover:bg-accent hover:text-[#014751] text-gray-600 dark:text-muted-foreground flex items-center gap-x-2 cursor-pointer p-2 pl-3 w-full"
                    >
                      <Facebook size={18} />
                      Share on Facebook
                    </Link>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(
                          decodeURIComponent(fullUrl)
                        );
                        toast.success("Link copied to clipboard!");
                      }}
                      className="rounded-xl hover:bg-gray-100 dark:hover:bg-accent hover:text-[#014751] text-gray-600 dark:text-muted-foreground flex items-center gap-x-2 cursor-pointer p-2 pl-3 w-full"
                    >
                      <IoIosLink size={18} />
                      Copy Link
                    </span>
                  </span>
                </button>
                <button
                  onClick={applyToJobHandler}
                  disabled={hasApplied || isPending}
                  className={`${
                    hasApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#49AD51] to-[#B1D045]"
                  } w-full md:w-fit px-3.5 py-2 font-normal text-white shadow-sm rounded-sm`}
                >
                  {hasApplied
                    ? "Applied"
                    : isPending
                      ? "Applying..."
                      : "Apply Now"}
                </button>
              </div>
            </div>
          </header>
          <div
            className="pt-10 prose prose-base dark:prose-inver dark:text-muted-foreground min-w-full"
            dangerouslySetInnerHTML={{
              __html:
                jobData?.data?.jobDescription || "<p>No content available</p>",
            }}
          />
        </div>
      )}
    </>
  );
}
