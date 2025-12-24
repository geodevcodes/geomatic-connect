"use client";
import { BlogCard, BlogSmallCard } from "@/app/components/cards/BlogCard";
import { BlogSkeleton } from "@/app/components/skeletons/BlogSkeleton";
import { useGetBlogsRequest } from "@/app/services/blog.request";
import { formatDate } from "@/utils/utils";
import { useState } from "react";
import Link from "next/link";

export default function BlogHome() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const skeletonArray = [1, 2, 3, 4, 5, 6];
  const { data: blogsData, isLoading } = useGetBlogsRequest(currentPage, limit);

  return (
    <div className="px-6 pb-20">
      <p className="w-full py-6 border-b border-slate-200 dark:border-b dark:border-muted">
        <span className="text-3xl">./</span>{" "}
        <span className="text-2xl">Blog</span> Insights for your job search
        journey
      </p>
      {blogsData?.data &&
        blogsData.data.filter((item: any) => item.active)[0] &&
        (() => {
          const featured = blogsData.data.filter((item: any) => item.active)[0];
          return (
            <Link href={`/blog/${featured.slug}`}>
              <BlogCard
                headings={featured.title}
                content={featured.subTitle}
                imageUrl={featured.banner}
                createdAt={formatDate(featured.createdAt)}
                readTime={featured.readTime}
              />
            </Link>
          );
        })()}
      {isLoading ? (
        <div className="mt-10 md:px-10 space-y-6">
          {skeletonArray.map((_, index) => (
            <BlogSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mt-8 py-8 px-6 rounded-2xl bg-white dark:bg-muted">
          {blogsData?.data
            ?.filter((item: any) => item.active)
            .map((item: any, index: number) => (
              <Link href={`/blog/${item.slug}`} key={index}>
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
    </div>
  );
}
