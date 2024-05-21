import React from "react";
import SideNav from "./components/SideNav";
import ChangeLogsListContainer from "./components/ChangeLogsListContainer";
import { getOneProject } from "@/lib/project";
import { notFound } from "next/navigation";

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
    <div className="mx-auto max-w-7xl h-full overflow-hidden lg:py-4 lg:px-8">
      <div className="h-full lg:grid lg:grid-cols-12 lg:gap-x-5">
        <SideNav />

        <ChangeLogsListContainer />
      </div>
    </div>
  );
};

export default Page;
