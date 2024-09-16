import React from "react";
import Link from "next/link";
import { FolderPlusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Button } from "@/atoms/button";

type EmptyPagePropsType = {
  id?: string;
  title?: string;
  description?: string;
  btnText?: string;
  navigateTo?: string;
};

const EmptyPage: React.FC<EmptyPagePropsType> = ({
  id = "",
  title = "",
  description = "",
  btnText = "",
  navigateTo = "#",
}) => {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-10 pb-12 lg:pb-16">
      <div className="text-center">
        <FolderPlusIcon className="mx-auto h-12 w-12 text-gray-400" />

        <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>

        <div className="mt-6">
          <Link href={navigateTo}>
            <Button
              id={id}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="w-5 h-10 font-black cursor-pointer" />{" "}
              {btnText}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default EmptyPage;
