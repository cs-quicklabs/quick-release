import { getOneProject } from "@/lib/project";
import { notFound } from "next/navigation";
import React from "react";
import ChangelogPublicHeader from "./components/ChangelogPublicHeader";
import { Metadata, ResolvingMetadata } from "next";
import { PagePayloadType } from "@/types";
import { WEB_DETAILS } from "@/Utils/constants";

export async function generateMetadata(
  { params }: PagePayloadType,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { projectName } = params;

  let project;
  try {
    project = await getOneProject({ name: projectName });
  } catch (error) {
    console.error("Error fetching project:", error);
  }

  if (!project) {
    return { title: "Project Not Found" };
  }

  const title = "Changelogs";
  const ogDesc = "list of release changelogs";

  const logo = project.projectImgUrl?.split("/").slice(-2).join("/");

  return {
    title: project.name,
    description: ogDesc,
    icons: [
      {
        rel: "icon",
        url: project.projectImgUrl || WEB_DETAILS.favicon,
      },
    ],
    openGraph: {
      title,
      description: ogDesc,
      url: `${process.env.BASEURL}/${projectName}/changelogs`,
      images: [
        `${
          process.env.BASEURL
        }/api/ogImage?title=${title}&description=${ogDesc}&teamName=${
          project.name
        }${logo ? "&logo=" + logo : ""}`,
      ],
    },
  };
}

const Page: React.FC<PagePayloadType> = async ({ params }) => {
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
