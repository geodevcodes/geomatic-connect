import JobDetails from "@/app/components/job-listings/JobDetails";
import { use } from "react";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const jobId = id;
  return (
    <div className="min-h-screen p-6 pt-24 lg:p-12 xl:p-20 lg:pt-32 xl:pt-32 font-sans text-md">
      <JobDetails jobId={jobId} />
    </div>
  );
}
