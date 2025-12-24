"use client";
import SubscribeModal from "@/app/components/student-components/SubscribeModal";
import { useGetUserByIdRequest } from "@/app/services/request.request";
import CompanyCard from "@/app/components/cards/CompanyCard";
import ReactSelect from "@/app/components/inputs/ReactSelect";
import { Modal } from "@/app/components/modals/Modal";
import { stateData } from "@/utils/FilterData";
import { useDebounce } from "use-debounce";
import { useState } from "react";

interface StudentHomeProps {
  session: any;
}

export default function StudentHome({ session }: StudentHomeProps) {
  const userId = session?.user?._id;
  const token = session.user.token;
  const [showSendRequest, setShowSendRequest] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [showSubscribe, setShowSubscribe] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const { data: userData } = useGetUserByIdRequest(userId);

  return (
    <>
      {/* ====== Filter & Search Goes here ====== */}
      <div className="mb-10 lg:mt-12 xl:mt-6 items-center justify-between bg-[#ECF1F7] dark:bg-muted lg:flex p-4 xl:mb-10">
        <div className="md:flex items-center">
          <p>Filter By:</p>
          <div className="md:flex space-y-2 mt-3 md:mt-0 md:space-y-0 md:ml-3 md:space-x-3">
            {/* === DropDown Input === */}
            <div className="w-[226px]">
              <input
                type="text"
                onChange={(e: any) => setSearch(e.target.value)}
                className="border border-[#cbd5e1] dark:border-muted-foreground dark:bg-transparent w-full p-4 cursor-text placeholder:text-sm focus:border-green-600 focus:ring-0 focus:outline-none"
                placeholder="Search by company name"
              />
            </div>
            <div className="w-[153px]">
              <ReactSelect
                options={stateData}
                placeholder="All State"
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
        <CompanyCard
          token={token}
          setSelectedCompanyId={setSelectedCompanyId}
          selectedCompanyId={selectedCompanyId}
          showSendRequest={showSendRequest}
          setShowSendRequest={setShowSendRequest}
          userData={userData}
          selectedState={selectedState}
          search={debouncedSearch}
        />
      </div>
      <Modal show={showSubscribe} onClose={() => setShowSubscribe(false)}>
        <SubscribeModal setShowSubscribe={setShowSubscribe} />
      </Modal>
    </>
  );
}
