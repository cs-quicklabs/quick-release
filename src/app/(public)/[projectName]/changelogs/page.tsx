import { Navbar } from "@/components/Navbar";
import ChangeLogsListContainer from "./components/ChangeLogsListContainer";
import SideNav from "./components/SideNav";
import { getOneProject } from "@/lib/project";
import { notFound } from "next/navigation";
import React from "react";
import ChangelogPublicHeader from "./components/ChangelogPublicHeader";

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
    <div className="contents overflow-hidden">
      <ChangelogPublicHeader project={project} />
    </div>
  );
};

export default Page;
