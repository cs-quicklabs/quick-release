import { getOneProject } from "@/lib/project";
import { notFound } from "next/navigation";
import React from "react";
import FeedbackPublicSideNav from "../(common)/FeedbackPublicSideNav";
import FeedbackPublicContentContainer from "./components/FeedbackPublicContentContainer";
import FeedbackHeader from "../(common)/FeedbackHeader";
import { IFeedbackBoard } from "@/interfaces";
import { Navbar } from "@/components/Navbar";
import { Metadata, ResolvingMetadata } from "next";
import { WEB_DETAILS } from "@/Utils/constants";
import { PagePayloadType } from "@/types";

export async function generateMetadata(
  { params }: PagePayloadType,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { projectName } = params;

  let project;
  try {
    project = await getOneProject({ name: projectName });
  } catch (error) {
    console.error("Error fetching feedback:", error);
  }

  if (!project) {
    return { title: "Project Not Found" };
  }

  const title = "Feedback Posts";
  const ogDesc = "All list of feedbacks";

  const logo = project.projectImgUrl?.split("/").slice(-2).join("/");

  return {
    title: project.name,
    description: "All list of feedbacks",
    icons: [
      {
        rel: "icon",
        url: project.projectImgUrl || WEB_DETAILS.favicon,
      },
    ],
    openGraph: {
      title,
      description: ogDesc,
      url: `${process.env.BASEURL}/${projectName}/feedbacks`,
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

  const feedbackBoards = project?.feedbackBoards as unknown as IFeedbackBoard[];

  return (
    <div className="contents overflow-hidden">
      <div className={`sticky top-0 bg-gray-50 z-10`}>
        <Navbar
          projectName={project.name!}
          projectImgUrl={project.projectImgUrl!}
          projectSlug={project.slug!}
        />
      </div>
      <main className="flex flex-col">
        <FeedbackHeader title="Feedbacks" />
        <div className="flex flex-1">
          <div className="min-w-0 flex-1 border-t border-gray-200 xl:flex">
            <FeedbackPublicSideNav feedbackBoards={feedbackBoards} />

            <FeedbackPublicContentContainer feedbackBoards={feedbackBoards} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
