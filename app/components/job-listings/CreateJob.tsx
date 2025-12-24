"use client";
import { useCreateJobRequest } from "@/app/services/job.request";
import {
  accommodationData,
  experienceData,
  jobTypeData,
  stateData,
} from "@/utils/FilterData";
import ReactSelect from "@/app/components/inputs/ReactSelect";
import { ArrowRight, LoaderCircle, X } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { formats, modules } from "@/utils/utils";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const schema = yup.object().shape({
  jobTitle: yup
    .string()
    .required("Job Title is required")
    .min(3, "Job Title must be greater than 3 letters"),
  location: yup.string().required("Location is required"),
  experienceLevel: yup.string().required("Experience Level is required"),
  accommodation: yup
    .mixed<true | false>()
    .oneOf([true, false], "Accommodation is required")
    .required("Accommodation is required"),
  jobType: yup.string().required("Job Type is required"),
});

interface CreateJobProps {
  setShowCreateJob?: any;
}
export default function CreateJob({ setShowCreateJob }: CreateJobProps) {
  const { mutate: createJob, isPending } = useCreateJobRequest();

  // REACT HOOK FORM LOGIC
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({ resolver: yupResolver(schema) });
  const experienceLevelValue = watch("experienceLevel");
  const locationValue = watch("location");
  const jobTypeValue = watch("jobType");

  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);

  // Initialize Quill
  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: modules.toolbar,
          },
        },
        formats: formats,
      });
    }
  }, []);

  // Submit handler for the form
  const onSubmitHandler = async (data: any) => {
    const jobDescription = quillInstance.current.root.innerHTML;
    const payload = {
      experienceLevel: data?.experienceLevel,
      accommodation: data?.accommodation,
      jobTitle: data?.jobTitle,
      location: data?.location,
      jobType: data?.jobType,
      jobDescription,
    };
    createJob(
      {
        payload,
      },
      {
        onSuccess: () => {
          setShowCreateJob(false);
        },
        onError: () => {
          console.log("error creating job");
        },
      }
    );
  };

  return (
    <div className="max-w-md md:min-w-[600px] lg:min-w-[700px] mx-auto p-6 md:p-8 bg-white dark:bg-background border border-gray-200 dark:border-muted rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Create Job</h1>
          <p className="text-muted-foreground mb-6">
            This form allows you to create a job listing.
          </p>
        </div>
        <button
          onClick={() => setShowCreateJob(false)}
          className="self-start rounded-md gap-6 text-gray-500 hover:text-gray-500 hover:bg-slate-100 dark:hover:bg-muted p-2 m-2 cursor-pointer"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Job listing form content will go here */}
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="lg:grid grid-cols-2 md:gap-6 max-w-[1400px]">
          <div>
            {/* ====Job Title === */}
            <div>
              <label htmlFor="name">
                <span className="text-sm font-medium">Job Title</span>
                <input
                  type="text"
                  placeholder="Cadastral Surveyor"
                  {...register("jobTitle")}
                  className={`${
                    errors.jobTitle && "border-[1.3px] border-red-500"
                  } w-full border border-slate p-3 py-5 focus:outline-none text-sm dark:border dark:border-slate-200 dark:bg-background`}
                />
              </label>
            </div>
            {/* =====Experience Level ===== */}
            <section>
              <div className="rounded-xl bg-white dark:bg-background max-w-[540px] mt-4">
                <label
                  htmlFor="experienceLevel"
                  className="text-sm font-medium"
                >
                  Experience Level
                </label>
                <div
                  className={`${
                    errors.experienceLevel
                      ? "border-[1.3px] border-red-500"
                      : ""
                  } flex flex-col w-full`}
                >
                  <ReactSelect
                    options={experienceData}
                    placeholder="Your Experience Level"
                    value={experienceData.find(
                      (option) => option.value === experienceLevelValue
                    )}
                    onChange={(option: any) => {
                      setValue("experienceLevel", option?.value || "");
                      trigger("experienceLevel");
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
          <div>
            {/* === Location Requirement Input === */}
            <section>
              <label htmlFor="location" className="text-sm font-medium">
                Location Requirement
              </label>
              <div
                className={`${
                  errors.location ? "border-[1.3px] border-red-500" : ""
                } flex flex-col w-full`}
              >
                <ReactSelect
                  options={stateData}
                  placeholder="Your Location"
                  value={stateData.find(
                    (option) => option.value === locationValue
                  )}
                  onChange={(option: any) => {
                    setValue("location", option?.value || "");
                    trigger("location");
                  }}
                />
              </div>
            </section>

            {/* ===== Job Type  ===== */}
            <section>
              <div className="rounded-xl bg-white dark:bg-background max-w-[540px] mt-4">
                <label htmlFor="jobType" className="text-sm font-medium">
                  Job Type
                </label>
                <div
                  className={`${
                    errors.jobType ? "border-[1.3px] border-red-500" : ""
                  } flex flex-col w-full`}
                >
                  <ReactSelect
                    options={jobTypeData}
                    placeholder="Select Job Type"
                    value={jobTypeData.find(
                      (option) => option.value === jobTypeValue
                    )}
                    onChange={(option: any) => {
                      setValue("jobType", option?.value || "");
                      trigger("jobType");
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
        {/* === Accommodation Dropdown Input === */}
        <div className="mt-3 mb-5">
          <label htmlFor="accomodation" className="text-sm font-medium">
            Accommodation
          </label>
          <div
            className={`${
              errors.accommodation ? "border-[1.3px] border-red-500" : ""
            } flex flex-col w-full`}
          >
            <ReactSelect
              options={accommodationData}
              placeholder="Select Accommodation"
              onChange={(option: any) => {
                setValue("accommodation", option?.value);
                trigger("accommodation");
              }}
            />
          </div>
        </div>

        {/* ====== Description ===== */}
        <div className="sm:col-span-2">
          <label
            htmlFor="content"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <div ref={editorRef} style={{ height: "500px" }} />
        </div>

        <div>
          <button
            disabled={isPending}
            className="relative group w-full mt-6 rounded-md flex items-center justify-center px-3.5 py-3 font-light text-white shadow-sm cursor-pointer bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:bg-muted dark:bg-gradient-to-r dark:from-muted-foreground dark:to-muted"
          >
            {isPending ? (
              <span className="flex space-x-4 gap-3">
                <LoaderCircle className="animate-spin" /> Creating...
              </span>
            ) : (
              <span className="flex items-center gap-4 justify-center relative">
                Save Now
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
