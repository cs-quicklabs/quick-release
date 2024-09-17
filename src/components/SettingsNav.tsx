"use client";
import BoardIcon from "@/assets/icons/BoardIcon";
import ChangePasswordSVG from "@/assets/icons/ChangePasswordSVG";
import LockIcon from "@/assets/icons/LockIcon";
import ProfileSVG from "@/assets/icons/ProfileSVG";
import { SwatchIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

type SettingsNavProps = {
  isProfileSettings: boolean;
  isAccountSettings: boolean;
}

const SettingsNav = (
  { isProfileSettings, isAccountSettings }: SettingsNavProps
) => {
  const pathname = usePathname();
  useEffect(() => {
    // Scroll to the top of the page when the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);
  const navLinks = isProfileSettings ? [
    {
      href: "/settings/profile/general",
      text: "Profile",
      icon: <ProfileSVG />,
    },
    {
      href: "/settings/profile/password",
      text: "Change Password",
      icon: <ChangePasswordSVG />,
    },
    // {
    //   href: "/allLogs",
    //   text: "Email Prefrences",
    //   icon: <EmailPrefrencesSVG />,
    // },

  ] : isAccountSettings ? [
    {
      href: "/settings/account/tags",
      text: "Tags",
      icon: <LockIcon />,
    },
    {
      href: "/settings/account/categories",
      text: "Categories",
      icon: <SwatchIcon className="w-6 h-6" />,
    },
  ] : [
    {
      href: "/settings/team/general",
      text: "General",
      icon: <ProfileSVG />,
    },
    {
      href: "/settings/team/boards",
      text: "Feedback Boards",
      icon: <LockIcon />,
    },
  ];
  return (
    <aside className="px-2 py-6 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
      <nav className="space-y-1">
        {navLinks.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <div
              key={item.text}
            >
              <Link
                href={item.href}
                className={`${
                  isActive ? "bg-gray-200" : ""
                } text-gray-900 hover:bg-gray-200 rounded px-3 py-2 flex items-center text-sm font-medium`}
              >
                <div className="py-[2px]">{item.icon}</div>
                <span className="truncate ml-2">{item.text}</span>
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default SettingsNav;