import { classNames } from "@/lib/utils";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import Link from "next/link";
import React from "react";

const publicNavItems = [
  {
    id: "changelog",
    name: "Changelog",
    href: `/changelogs`,
  },
  {
    id: "feedback",
    name: "Feedback",
    href: `/feedbacks`,
  },
  {
    id: "roadmap",
    name: "Roadmap",
    href: `/roadmap`,
  },
];

interface PublicNavbarProps {
  teamName: string;
  pathname: string;
  projectSlug?: string;
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({
  teamName,
  pathname,
  projectSlug,
}) => {
  return (
    <Disclosure as="nav" className="bg-gray-50 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="relative z-10 flex px-2 lg:px-0">
            <div className="flex shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />{" "}
              <h1 className="lg:ml-4 text-black font-extrabold font-mono py-2">
                {teamName}
              </h1>
            </div>
          </div>
          <div className="flex items-center lg:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </DisclosureButton>
          </div>
        </div>
        <nav
          className="hidden lg:flex lg:space-x-2 lg:py-2"
          aria-label="Global"
        >
          {publicNavItems.map((item) => (
            <Link
              key={item.id}
              href={`/${projectSlug}/${item.href}`}
              className={classNames(
                "inline-flex items-center rounded-md  px-3 py-2 text-sm font-medium ",
                pathname.includes(item.href)
                  ? "text-gray-900 bg-gray-200"
                  : "text-gray-900 hover:bg-gray-50 hover:text-gray-900"
              )}
              aria-current="page"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <DisclosurePanel className="block lg:hidden">
          {publicNavItems.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={`/${projectSlug}/${item.href}`}
              className={classNames(
                pathname.includes(item.href)
                  ? "text-gray-900 bg-gray-200"
                  : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </DisclosurePanel>
      </div>
    </Disclosure>
  );
};

export default PublicNavbar;
