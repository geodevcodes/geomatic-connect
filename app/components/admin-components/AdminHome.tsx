"use client";
import { StatisticsSkeleton } from "@/app/components/skeletons/StatisticsSkeleton";
import { StatisticsCard } from "@/app/components/cards/StatisticsCard";
import UsersList from "@/app/components/admin-components/UsersList";
import { useGetUsersRequest } from "@/app/services/users.request";
import { Sheet } from "@/app/components/sheets/Sheet";
import Trash from "@/app/components/trash/Trash";
import { useDebounce } from "use-debounce";
import AddCompany from "./AddCompany";
import { Plus } from "lucide-react";
import { useState } from "react";

interface AdminHomeProps {
  token: string;
}
export default function AdminHome({ token }: AdminHomeProps) {
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);

  const { data: userData, isLoading } = useGetUsersRequest(
    currentPage,
    limit,
    debouncedSearch
  );

  return (
    <>
      <main className="flex min-h-screen flex-col pt-24 lg:pt-32">
        <div className="md:flex items-center md:space-x-4">
          <div className="w-full">
            <p className="text-gray-600 text-lg font-semibold dark:text-accent-foreground">
              Manage Users
            </p>
            <p className="text-sm text-gray-500 font-normal">
              Administer user accounts and privileges within the platform.
            </p>
          </div>
          <div
            onClick={() => setShowAddCompany(true)}
            className="my-4 flex p-2 md:p-3 justify-center items-center gap-[8px] rounded-[8px] text-white w-full md:w-[200px] lg:w-[200px] cursor-pointer  px-3.5 py-4 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045] dark:bg-muted dark:bg-gradient-to-r dark:from-muted dark:to-muted-foreground"
          >
            <p className="text-[#FFFFFF] text-sm md:text-md">Create user</p>
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>
        {userData?.data?.length === 0 && !debouncedSearch ? (
          <div className="gap-2 my-6">
            <Trash
              headingText="Start Adding Users"
              subHeadingText="No users have been added yet. Click the 'Add User' button above to create a new user."
            />
          </div>
        ) : (
          <>
            {isLoading ? (
              <div>
                <StatisticsSkeleton />
              </div>
            ) : (
              <div className="my-8 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-6">
                <StatisticsCard
                  title={"Users"}
                  value={userData?.meta?.totalUsers}
                />
                <StatisticsCard
                  title={"Companies"}
                  value={userData?.meta?.totalCompanies}
                />
                <StatisticsCard
                  title={"Students"}
                  value={userData?.meta?.totalStudents}
                />
                <StatisticsCard
                  title={"Admins"}
                  value={userData?.meta?.totalAdmins}
                />
              </div>
            )}

            <UsersList
              userData={userData}
              isLoading={isLoading}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              limit={limit}
              setSearch={setSearch}
              debouncedSearch={debouncedSearch}
            />
          </>
        )}
      </main>

      {/*============ SHEETS ============ */}
      {/* === Add Company === */}
      <Sheet show={showAddCompany} onClose={() => setShowAddCompany(false)}>
        <AddCompany setShowAddCompany={setShowAddCompany} />
      </Sheet>
    </>
  );
}
