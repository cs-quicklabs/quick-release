import { WEB_DETAILS } from "@/Utils/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavPublic = () => {
  return (
    <header>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
        <div className="relative flex py-3 justify-between">
          <div className="relative z-10 flex px-2 lg:px-0">
            <Link href="/">
              <div className="flex flex-shrink-0 items-center">
                <Image
                  className="block h-8 w-auto"
                  src={WEB_DETAILS.logo}
                  alt={WEB_DETAILS.name}
                  width={32}
                  height={32}
                />
                <h1 className="text-gray-600 ml-2 font-extrabold font-mono py-2">
                  {WEB_DETAILS.name}
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavPublic;
