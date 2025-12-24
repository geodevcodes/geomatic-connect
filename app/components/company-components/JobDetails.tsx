"use client";
import { JobSkeleton } from "@/app/components/skeletons/JobSkeleton";
import Applicants from "@/app/components/job-listings/Applicants";
import DeleteJob from "@/app/components/job-listings/DeleteJob";
import EditJob from "@/app/components/job-listings/EditJob";
import { Rss, SquarePen, Trash2 } from "lucide-react";
import { Modal } from "@/app/components/modals/Modal";
import { useSession } from "next-auth/react";
import {
  useDeleteJobRequest,
  useGetJobRequest,
  useUpdateJobRequest,
} from "@/app/services/job.request";
import { useState } from "react";
import Image from "next/image";

interface JobDetailsProps {
  jobId: string;
}
export default function JobDetails({ jobId }: JobDetailsProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);
  const { data: session } = useSession();
  const token = session?.user?.token as string;
  const { data: jobData, isLoading } = useGetJobRequest(jobId as string);
  const { mutate: updateJobRequest } = useUpdateJobRequest();
  const { mutate: deleteJob } = useDeleteJobRequest();

  // Publish Job handler
  const updateJobHandler = async () => {
    const payload = {
      active: jobData?.data?.active ? false : true,
    };
    updateJobRequest(
      { jobId, payload },
      {
        onSuccess: () => {
          console.log("job updated successfully");
        },
        onError: () => {
          console.log("error updating job");
        },
      }
    );
  };

  // Delete A Job Request Logic
  const deleteJobHandler = async () => {
    deleteJob(
      { jobId },
      {
        onSuccess: () => {
          console.log("job deleted successfully");
        },
        onError: () => {
          console.log("error deleting the job");
        },
      }
    );
  };

  return (
    <>
      <main>
        {isLoading ? (
          <div>
            <JobSkeleton />
          </div>
        ) : (
          <div>
            <section>
              <div className="border border-slate-300 dark:border-muted p-4 rounded-xl mb-5 block">
                <section className="flex items-start justify-between">
                  <div className="flex gap-3 items-center">
                    {jobData?.data?.companyId?.avatarImage ? (
                      <Image
                        src={jobData.data.companyId.avatarImage}
                        alt="company brand logo"
                        width={100}
                        height={100}
                        className="w-[70px] h-[70px] border-[1.3px] border-slate-200 items-center justify-center flex rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-[70px] h-[70px] border-[1.3px] border-slate-200 items-center justify-center flex rounded-full bg-gray-100 text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                    <div>
                      <p className="font-semibold ">
                        {jobData?.data?.jobTitle}
                      </p>
                      <p className="text-gray-500">
                        {jobData?.data?.companyId.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center justify-end">
                    <p
                      onClick={() => setShowEditJob(true)}
                      className="cursor-pointer bg-slate-400 text-white h-fit py-1.5 px-4 rounded-lg text-xs flex items-center gap-2"
                    >
                      <SquarePen className="size-4" /> Edit
                    </p>
                    <p
                      onClick={() => updateJobHandler()}
                      className="cursor-pointer bg-green-500 text-white h-fit py-1.5 px-4 rounded-lg text-xs flex items-center gap-2"
                    >
                      <Rss className="size-4" />
                      {jobData?.data?.active ? "UnPublish" : "Publish"}
                    </p>
                    <p
                      onClick={() => setShowConfirmDelete(true)}
                      className="cursor-pointer bg-red-500 text-white h-fit py-1.5 px-4 rounded-lg text-xs flex items-center gap-2"
                    >
                      <Trash2 className="size-4" /> Delete
                    </p>
                  </div>
                </section>
                <section className="flex flex-wrap gap-4 items-center mt-3">
                  <span className="border border-slate-300 dark:border-muted-foreground dark:text-muted-foreground px-4 py-1 rounded-lg text-sm">
                    Featured
                  </span>
                  <span className="border border-slate-300 dark:border-muted-foreground dark:text-muted-foreground px-4 py-1 rounded-lg text-sm">
                    {jobData?.data?.experienceLevel}
                  </span>
                  <span className="border border-slate-300 dark:border-muted-foreground dark:text-muted-foreground px-4 py-1 rounded-lg text-sm">
                    {jobData?.data?.jobType}
                  </span>
                  <span className="border border-slate-300 dark:border-muted-foreground dark:text-muted-foreground px-4 py-1 rounded-lg text-sm">
                    {jobData?.data?.location}
                  </span>
                </section>
              </div>
            </section>
            <section>
              <Applicants applicantsData={jobData?.data?.applicants ?? []} />
            </section>
          </div>
        )}
      </main>
      <Modal show={showEditJob} onClose={() => setShowEditJob(false)}>
        <EditJob
          jobData={jobData}
          jobId={jobId}
          token={token}
          setShowEditJob={setShowEditJob}
        />
      </Modal>
      <Modal
        show={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
      >
        <DeleteJob
          setShowConfirmDelete={setShowConfirmDelete}
          deleteJobHandler={deleteJobHandler}
        />
      </Modal>
    </>
  );
}
