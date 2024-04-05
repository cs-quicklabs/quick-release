import React from "react";
import Link from "next/link";

const NavPublic = () => {
  return (
    <header>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="relative z-10 flex px-2 lg:px-0">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/quick-release">
                <img
                  className="block h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&amp;shade=600"
                  alt="Quick Release"
                />
              </Link>

              <h1 className="text-gray-600 ml-2 font-extrabold font-mono py-2">Quick Release</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavPublic;
