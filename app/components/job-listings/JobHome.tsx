"use client";
import { JobSkeleton } from "@/app/components/skeletons/JobSkeleton";
import JobListingCard from "@/app/components/cards/JobListingCard";
import CreateJob from "@/app/components/job-listings/CreateJob";
import { useGetJobsRequest } from "@/app/services/job.request";
import { Modal } from "@/app/components/modals/Modal";
import { useState } from "react";

export default function JobHome() {
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const { data: jobsData, isLoading } = useGetJobsRequest(currentPage, limit);

  return (
    <>
      {isLoading ? (
        <div>
          <JobSkeleton />
        </div>
      ) : (
        jobsData?.data?.map((item: any, index: number) => (
          <div key={index}>
            <JobListingCard
              itemId={item._id}
              imageUrl={item?.companyId?.avatarImage}
              title={item.jobTitle}
              companyName={item.companyId.companyName}
              createdTime={item.createdAt}
              level={item.experienceLevel}
              jobType={item.jobType}
              location={item.location}
            />
          </div>
        ))
      )}
      <Modal show={showCreateJob} onClose={() => setShowCreateJob(false)}>
        <CreateJob setShowCreateJob={setShowCreateJob} />
      </Modal>
    </>
  );
}
