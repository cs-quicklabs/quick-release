import ChangeLogsListContainer from "./components/ChangeLogsListContainer";
import SideNav from "./components/SideNav";
import { getOneProject } from "@/lib/project";
import { notFound } from "next/navigation";
import React from "react";

type PagePropsType = {
  params: {
    projectName: string;
  };
};

const Page: React.FC<PagePropsType> = async ({ params }) => {
  let { projectName } = params;
  projectName = projectName.toLowerCase();

  let project;
  try {
    project = await getOneProject({ name: projectName });
  } catch (error: any) {
    console.log("Failed to get project details", error);
  }

  if (!project) {
    return notFound();
  }

  return (
    <div className="mx-auto max-w-7xl overflow-hidden lg:py-4 lg:px-8">
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-5">
        <div className="lg:hidden lg:col-span-3 fixed top-12 bg-white z-10 w-full">
          <SideNav />
        </div>
        <div className="hidden lg:block lg:col-span-3">
          <SideNav />
        </div>
        <div className="mt-[16rem] lg:col-span-9 lg:mt-0">
        <ChangeLogsListContainer />
        </div>
      </div>
    </div>
  );
};

export default Page;
