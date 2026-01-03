"use client";
import { BlogCard, BlogSmallCard } from "@/app/components/cards/BlogCard";
import { BlogSkeleton } from "@/app/components/skeletons/BlogSkeleton";
import { useGetBlogsRequest } from "@/app/services/blog.request";
import { ArrowLeft, Plus } from "lucide-react";
import { formatDate } from "@/utils/utils";
import CreateBlog from "./CreateBlog";
import { useState } from "react";
import Link from "next/link";

export default function BlogHome() {
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const skeletonArray = [1, 2, 3, 4, 5, 6];
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const { data: blogsData, isLoading } = useGetBlogsRequest(currentPage, limit);

  return (
    <>
      <main className="flex min-h-screen flex-col pt-24 lg:pt-24">
        <div className="pb-20">
          <div className="border-b border-slate-200  dark:border-muted md:flex items-center justify-between">
            <p className="text-sm">
              <span className="text-3xl">./</span>{" "}
              <span className="text-2xl">Blog</span> Insights for your job
              search journey
            </p>
            <div onClick={() => setShowCreateBlog((prev) => !prev)}>
              {showCreateBlog ? (
                <div className="my-4 flex p-2 md:p-3 justify-center items-center gap-[8px] rounded-[8px] text-white w-full md:w-[150px] cursor-pointer  px-3.5 py-4 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045]">
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                  <p className="text-[#FFFFFF] text-sm md:text-md">
                    Back to Blog
                  </p>
                </div>
              ) : (
                <div className="my-4 flex p-2 md:p-3 justify-center items-center gap-[8px] rounded-[8px] text-white w-full md:w-[150px] cursor-pointer  px-3.5 py-4 font-light shadow-sm bg-gradient-to-r from-[#49AD51] to-[#B1D045]">
                  <p className="text-[#FFFFFF] text-sm md:text-md">
                    Create Blog
                  </p>
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              )}
            </div>
          </div>

          {showCreateBlog ? (
            <div className="mt-8 rounded-2xl border border-slate-200 dark:border-background bg-white dark:bg-muted">
              <CreateBlog setShowCreateBlog={setShowCreateBlog} />
            </div>
          ) : (
            <section className="w-full max-w-5xl text-sm">
              {blogsData?.data?.[0] && (
                <Link href={`/admin-dashboard/blog/${blogsData.data[0].slug}`}>
                  <BlogCard
                    headings={blogsData.data[0].title}
                    content={blogsData.data[0].subTitle}
                    imageUrl={blogsData.data[0].banner}
                    createdAt={formatDate(blogsData.data[0].createdAt)}
                    readTime={blogsData.data[0].readTime}
                  />
                </Link>
              )}

              {isLoading ? (
                <div className="mt-10 space-y-6">
                  {skeletonArray.map((_, index) => (
                    <BlogSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-8 py-8 lg:px-6 rounded-2xl bg-white dark:bg-muted">
                  {blogsData?.data?.map((item: any, index: number) => (
                    <Link
                      href={`/admin-dashboard/blog/${item.slug}`}
                      key={index}
                    >
                      <BlogSmallCard
                        headings={item.title}
                        content={item.subTitle}
                        imageUrl={item.banner}
                        createdAt={formatDate(item.createdAt)}
                        readTime={item.readTime}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
