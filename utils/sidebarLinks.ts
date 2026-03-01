import {
  CreditCard,
  PencilLine,
  LayoutGrid,
  ChartNoAxesCombined,
  User,
  BriefcaseBusiness,
} from "lucide-react";
import { FaQ } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { MdOutlinePayment, MdSupportAgent } from "react-icons/md";
import { RiMessage2Line } from "react-icons/ri";

export const adminNavItems = [
  {
    name: "Home",
    href: "/admin-dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Requests",
    href: "/admin-dashboard/requests",
    icon: RiMessage2Line,
  },
  {
    name: "Jobs",
    href: "/admin-dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Billing",
    href: "/admin-dashboard/billing",
    icon: CreditCard,
  },
];

export const companyNavItems = [
  {
    name: "Home",
    href: "/company-dashboard",
    icon: LayoutGrid,
  },
  {
    name: "My Jobs",
    href: "/company-dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Overview",
    href: "/company-dashboard/overview",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Subscribe",
    href: "/company-dashboard/subscribe",
    icon: CreditCard,
  },
];

export const studentNavItems = [
  {
    name: "Home",
    href: "/student-dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Jobs",
    href: "/student-dashboard/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Overview",
    href: "/student-dashboard/overview",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Billing",
    href: "/student-dashboard/billing",
    icon: CreditCard,
  },
];

// MobileLinks (Navbar)
export const adminMobileRoutes = [
  {
    name: "Dashboard",
    href: `/admin-dashboard`,
  },
  {
    name: "Notifications",
    href: "/admin-dashboard/requests",
  },
  {
    name: "Billings",
    href: "/admin-dashboard/billing",
  },
  {
    name: "Settings",
    href: "/admin-dashboard/settings",
  },
];

export const companyMobileRoutes = [
  {
    name: "Dashboard",
    href: "/company-dashboard",
  },
  {
    name: "Notifications",
    href: "/company-dashboard/notifications",
  },
  {
    name: "Settings",
    href: "/company-dashboard/settings",
  },
  {
    name: "Subscribe",
    href: "/company-dashboard/subscribe",
  },
];

export const studentMobileRoutes = [
  {
    name: "Dashboard",
    href: "/student-dashboard",
  },
  {
    name: "Notifications",
    href: "/student-dashboard/notifications",
  },
  {
    name: "Settings",
    href: "/student-dashboard/settings",
  },
  {
    name: "Billing",
    href: "/student-dashboard/billing",
  },
];

// Admin Bottom Navbar Route Links
export const adminBottomRouteLinks = [
  {
    name: "Home",
    href: "",
    key: "home",
    icon: GoHome,
  },
  {
    name: "Jobs",
    href: "/jobs",
    key: "jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Blog",
    href: "/blog",
    key: "blog",
    icon: PencilLine,
  },
  {
    name: "Requests",
    href: "/requests",
    key: "requests",
    icon: MdSupportAgent,
  },
];

// Bottom Navbar Route Links
export const bottomRouteLinks = [
  {
    name: "Home",
    href: "",
    key: "home",
    icon: GoHome,
  },
  {
    name: "Blog",
    href: "/blog",
    key: "blog",
    icon: PencilLine,
  },
  {
    name: "Overview",
    href: "/overview",
    key: "overview",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Jobs",
    href: "/jobs",
    key: "jobs",
    icon: MdOutlinePayment,
  },
  // {
  //   name: "Settings",
  //   href: "/settings",
  //   key: "settings",
  //   icon: User,
  // },
];

// Bottom Navbar Route Links
export const bottomLinks = [
  {
    name: "Home",
    href: "/",
    key: "home",
    icon: GoHome,
  },
  {
    name: "Blog",
    href: "/blog",
    key: "blog",
    icon: PencilLine,
  },
  {
    name: "FAQs",
    href: "/",
    icon: FaQ,
    key: "faq",
  },
  {
    name: "Support",
    href: "/",
    icon: MdSupportAgent,
    key: "support",
  },
];
