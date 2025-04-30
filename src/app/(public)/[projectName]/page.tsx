import React from "react";
import { RedirectType, notFound, redirect } from "next/navigation";
import { getOneProject } from "@/lib/project";

type PagePropsType = {
  params: Promise<{
    projectName: string;
  }>;
};

const Page: React.FC<PagePropsType> = async (props) => {
  const params = await props.params;
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

  return redirect(`/${projectName}/changelogs`, RedirectType.replace);
};

export default Page;
