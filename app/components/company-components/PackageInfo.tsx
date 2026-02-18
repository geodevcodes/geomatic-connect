"use client";
import { packageData } from "@/utils/PackageData";
import { motion } from "framer-motion";

export default function PackageInfo() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* ==========Plan Package goes here ============ */}
        <section className="w-full py-4 pb-10 text-xs md:text-sm">
          <div className="flex flex-col gap-1 text-[#575D72]">
            <div className="grid grid-cols-4 border-b py-3">
              <p className="col-span-1 dark:text-muted-foreground">
                Access to Email Notifications
              </p>
              {packageData?.accessToEmailNotifications?.map((dt, i) => (
                <div
                  key={i + 1}
                  className="col-span-1 text-end flex items-center justify-end lg:w-[75%]"
                >
                  {dt}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border-b py-3">
              <p className="col-span-1 dark:text-muted-foreground">
                Access to Community Channel
              </p>
              {packageData?.communityChannel?.map((dt, i) => (
                <div
                  key={i + 1}
                  className="col-span-1 text-end flex items-center justify-end lg:w-[75%]"
                >
                  {dt}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border-b py-3">
              <p className="col-span-1 dark:text-muted-foreground">
                Access to Companies
              </p>
              {packageData?.accessToCompany?.map((dt, i) => (
                <div
                  key={i + 1}
                  className="col-span-1 text-end dark:text-muted-foreground flex items-center justify-end lg:w-[75%]"
                >
                  {dt}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border-b py-3">
              <p className="col-span-1 dark:text-muted-foreground">
                Requests per Month
              </p>
              {packageData?.requestsPerMth?.map((dt, i) => (
                <div
                  key={i + 1}
                  className="col-span-1 text-end dark:text-muted-foreground flex items-center justify-end lg:w-[75%]"
                >
                  {dt}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border-b py-3">
              <p className="col-span-1 dark:text-muted-foreground">
                Access to Surveyor General Office
              </p>
              {packageData?.cvBuilder?.map((dt, i) => (
                <div
                  key={i + 1}
                  className="col-span-1 text-end flex items-center justify-end lg:w-[75%]"
                >
                  {dt}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border-b py-3">
              <p className="col-span-1 dark:text-muted-foreground">
                Support Level
              </p>
              {packageData?.supportLevel?.map((dt, i) => (
                <div
                  key={i + 1}
                  className="col-span-1 text-end flex items-center justify-end lg:w-[75%] dark:text-muted-foreground"
                >
                  {dt}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border-b py-3">
              <p className="col-span-1 dark:text-muted-foreground">
                Curriculum Vitae (CV Builder)
              </p>
              {packageData?.cvBuilder?.map((dt, i) => (
                <div
                  key={i + 1}
                  className="col-span-1 text-end flex items-center justify-end lg:w-[75%]"
                >
                  {dt}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border-b py-3">
              <p className="col-span-1 dark:text-muted-foreground">
                AI Document Analyzer
              </p>
              {packageData?.documentAnalyzer?.map((dt, i) => (
                <div
                  key={i + 1}
                  className="col-span-1 text-end flex items-center justify-end lg:w-[75%]"
                >
                  {dt}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border-b py-3">
              <p className="col-span-1 dark:text-muted-foreground">
                Free Blogs & Articles update
              </p>
              {packageData?.blogs?.map((dt, i) => (
                <div
                  key={i + 1}
                  className="col-span-1 text-end flex items-center justify-end lg:w-[75%]"
                >
                  {dt}
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
}
