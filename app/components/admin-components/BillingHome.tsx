"use client";
import { StatisticsSkeleton } from "@/app/components/skeletons/StatisticsSkeleton";
import TransactionList from "@/app/components/admin-components/TransactionList";
import { StatisticsCard } from "@/app/components/cards/StatisticsCard";
import { useGetAllSubscriptions } from "@/app/services/payment.request";
import Trash from "@/app/components/trash/Trash";
import { useDebounce } from "use-debounce";
import { useState } from "react";

interface BillingHomeProps {
  token: string;
}

export default function BillingHome({ token }: BillingHomeProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const { data: subscriptionData, isLoading } = useGetAllSubscriptions(
    currentPage,
    limit,
    debouncedSearch
  );

  return (
    <main className="flex min-h-screen flex-col pt-24 lg:pt-32">
      <div className="w-full">
        <p className="text-gray-600 text-lg font-semibold dark:text-accent-foreground">
          Manage Transactions
        </p>
        <p className="text-sm text-gray-500 font-normal">
          Administer transactions histories within the platform.
        </p>
      </div>

      {subscriptionData?.data?.length === 0 && !debouncedSearch ? (
        <div className="gap-2 my-6">
          <Trash
            headingText="No Billing yet"
            subHeadingText="No billing have been made yet. Check back later."
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
                title={"Total Transaction"}
                value={subscriptionData?.meta?.totalTransactions}
              />
              <StatisticsCard
                title={"Success Transaction"}
                value={subscriptionData?.meta?.totalSuccess}
              />
              <StatisticsCard
                title={"Failed Transaction"}
                value={subscriptionData?.meta?.totalFailed}
              />
              <StatisticsCard
                title={"Abandoned Transaction"}
                value={subscriptionData?.meta?.totalAbandoned}
              />
            </div>
          )}

          <TransactionList
            subscriptionData={subscriptionData}
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
  );
}
