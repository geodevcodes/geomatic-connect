"use client";
import GeomaticLogo from "@/public/images/Geomatic-Connect-Logo2w.png";
import { MapPin, ShieldCheck, Zap, Quote } from "lucide-react";
import AuthImage from "@/public/images/auth-image.png";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const features = [
  { icon: MapPin, label: "Internship Matching" },
  { icon: ShieldCheck, label: "Verified Companies" },
  { icon: Zap, label: "Easy Applications" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
};

export default function LeftContainer() {
  return (
    <div className="relative hidden md:block md:w-[60%] xl:w-2/3 h-screen overflow-hidden">
      {/* ── BACKGROUND IMAGE ── */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={AuthImage}
          alt="Survey background"
          fill
          priority
          className="object-cover object-center"
          style={{ filter: "saturate(0.65) brightness(0.60)" }}
        />
      </motion.div>

      {/* ── DIRECTIONAL GRADIENT ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(6,20,12,0.97) 0%, rgba(8,28,18,0.88) 32%, rgba(10,35,22,0.58) 58%, rgba(10,35,22,0.10) 100%)",
        }}
      />

      {/* ── GRAIN TEXTURE ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      {/* ── CONTENT ── */}
      <motion.div
        className="absolute bottom-32 inset-0 z-10 flex flex-col justify-center px-14 xl:px-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* LOGO */}
        <motion.div variants={fadeIn} className="mb-12">
          <Link href="/">
            <Image
              src={GeomaticLogo}
              alt="Geomatic Connect"
              width={140}
              height={50}
              priority
              className="object-cover h-[120px] w-[120px]"
            />
          </Link>
        </motion.div>

        {/* HEADLINE */}
        <motion.div variants={fadeUp} className="mb-6">
          <h1
            className="font-serif text-white leading-[1.12] tracking-tight"
            style={{ fontSize: "clamp(48px, 3.2vw, 44px)" }}
          >
            Where Future{" "}
            <span
              className="font-serif leading-[1.12] tracking-tight text-[#3aaa72]"
              style={{ fontSize: "clamp(48px, 3.2vw, 44px)" }}
            >
              Surveyors
            </span>
          </h1>
          <h1
            className="font-serif text-white leading-[1.12] tracking-tight"
            style={{ fontSize: "clamp(48px, 3.2vw, 44px)" }}
          >
            Meet Industry.
          </h1>
        </motion.div>

        {/* RULE */}
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-[#3aaa72]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#3aaa72] opacity-60" />
          <div className="w-20 h-px bg-white/10" />
        </motion.div>

        {/* FEATURE LIST */}
        <motion.ul
          variants={containerVariants}
          className="space-y-4 mb-10 list-none p-0"
        >
          {features.map(({ icon: Icon, label }) => (
            <motion.li
              key={label}
              variants={fadeUp}
              className="flex items-center gap-3 group"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full border border-[#3aaa72]/30 bg-[#3aaa72]/10 group-hover:bg-[#3aaa72]/20 transition-colors duration-300 shrink-0">
                <Icon size={13} className="text-[#3aaa72]" strokeWidth={2} />
              </div>
              <span className="text-white/70 text-sm font-light tracking-wide group-hover:text-white/90 transition-colors duration-300">
                {label}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* TESTIMONIAL */}
        <motion.div
          variants={fadeUp}
          className="border-l-2 border-[#3aaa72]/35 pl-5 max-w-xs"
        >
          <Quote size={14} className="text-[#3aaa72]/50 mb-2" />
          <p
            className="text-white/50 text-[13px] italic leading-relaxed mb-2"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Secured my SIWES placement in just 2 weeks.
          </p>
          <span className="text-white/25 text-[10px] uppercase tracking-widest">
            SIWES Student · 2024
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
