"use client";
import { useGetUserByIdRequest } from "@/app/services/request.request";
import ReactSelect from "@/app/components/inputs/ReactSelect";
import StudentCard from "@/app/components/cards/StudentCard";
import { stateData } from "@/utils/FilterData";
import { useDebounce } from "use-debounce";
import { useState } from "react";

interface CompanyHomeProps {
  session: any;
}

export default function CompanyHome({ session }: CompanyHomeProps) {
  const userId = session?.user?._id;
  const [selectedState, setSelectedState] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const { data: userData } = useGetUserByIdRequest(userId);

  return (
    <>
      {/* ====== Filter & Search Goes here ====== */}
      <div className="mb-10 lg:mt-12 xl:mt-6  items-center justify-between bg-[#ECF1F7] dark:bg-muted lg:flex p-4 xl:mb-10">
        <div className="md:flex items-center">
          <p>Filter By:</p>
          <div className="md:flex space-y-2 mt-3 md:mt-0 md:space-y-0 md:ml-3 md:space-x-3">
            {/* === DropDown Input === */}
            <div className="w-[226px]">
              <input
                type="text"
                onChange={(e: any) => setSearch(e.target.value)}
                className="border border-[#cbd5e1] dark:border-muted-foreground dark:bg-transparent w-full p-4 cursor-text placeholder:text-sm focus:border-green-600 focus:ring-0 focus:outline-none"
                placeholder="Search by student name"
              />
            </div>
            <div className="w-[153px]">
              <ReactSelect
                options={stateData}
                placeholder="State"
                onChange={(option: any) => {
                  setSelectedState(option?.value || "");
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ====CARD GOES HERE ===== */}
      <div>
        <StudentCard
          companyId={userData?.data?._id}
          search={debouncedSearch}
          selectedState={selectedState}
        />
      </div>
    </>
  );
}
