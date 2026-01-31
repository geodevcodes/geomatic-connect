"use client";
import GeomaticLogo from "@/public/images/Geomatic-Connect-Logo2b.png";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LeftContainer() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = document.createElement("img");
    img.src = "/images/image2.jpg";
    img.onload = () => setIsLoading(false);
  }, []);

  return (
    <div className="relative w-full hidden md:w-[60%] xl:w-2/3 md:block">
      {/* ===== Background Image ===== */}
      <div
        className={`absolute inset-0 bg-center bg-no-repeat bg-cover ${
          isLoading ? "bg-gray-200" : "bg-[url(/images/image2.jpg)]"
        }`}
      />
      {/* =====Overlay with color and opacity==== */}
      <div className="absolute inset-0 bg-[#F1F4EA] opacity-80" />
      {/* ====Content==== */}
      <section className="h-screen absolute">
        <Link href="/" className="flex items-center">
          <Image
            src={GeomaticLogo}
            alt="Geomatic brand logo"
            width={200}
            height={200}
            priority
            className="object-cover w-[120px] z-[1000] h-[100px] relative text-[#1F4D36] text-4xl text-center flex justify-center items-center"
          />
        </Link>
      </section>
      <p className="relative h-full text-[#1F4D36] md:text-4xl xl:text-5xl text-center flex justify-center items-center font-bold font-serif">
        Geomatic Connect
      </p>
    </div>
  );
}
