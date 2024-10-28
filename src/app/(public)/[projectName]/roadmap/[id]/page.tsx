import React from "react";
import moment from "moment";
import { REVALIDATE_API, WEB_DETAILS } from "@/Utils/constants";
import { notFound } from "next/navigation";
import { FeedbackPostType, PagePayloadType } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import FeedbackHeader from "../../(common)/FeedbackHeader";
import FeedbackPublicSideNav from "../../(common)/FeedbackPublicSideNav";
import { getOneProject } from "@/lib/project";
import FeedbackDetailContainer from "../../feedbacks/components/FeedbackDetailContainer";
import { IFeedbackBoard } from "@/interfaces";
import { Navbar } from "@/components/Navbar";
import { getOneFeedbackPostDetails } from "@/lib/feedback";

export async function generateMetadata(
  { params }: PagePayloadType,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id, projectName } = params;

  let feedback;
  let project;
  try {
    project = await getOneProject({ name: projectName });
    feedback = await getOneFeedbackPostDetails(projectName, id);
  } catch (error) {
    console.error("Error fetching feedback:", error);
  }

  if (!project) {
    return { title: "Project Not Found" };
  }

  const logo = project.projectImgUrl?.split("/").slice(-2).join("/");

  if (!feedback?.id) {
    return { title: "feedback Not Found" };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const fullName = `${feedback.createdBy?.firstName || ""} ${
    feedback.createdBy?.lastName || ""
  }`.trim();
  const date = moment(feedback.createdAt).format("MMMM DD, YYYY");
  const ogDesc = `Feedback published on ${date} - ${fullName}`;

  return {
    title: project.name,
    description: feedback.title + " - " + ogDesc,
    icons: [
      {
        rel: "icon",
        url: project.projectImgUrl || WEB_DETAILS.favicon,
      },
    ],
    openGraph: {
      title: feedback.title,
      description: ogDesc,
      url: `${process.env.BASEURL}/${projectName}/roadmap/${id}`,
      images: [
        `${process.env.BASEURL}/api/ogImage?title=${
          feedback.title
        }&description=${ogDesc}&teamName=${project.name}${
          logo ? "&logo=" + logo : ""
        }`,
      ],
    },
  };
}

const Page: React.FC<PagePayloadType> = async ({ params }) => {
  const { id, projectName } = params;

  let feedbackpost;
  let project;
  try {
    feedbackpost = await getOneFeedbackPostDetails(projectName, id);
    project = await getOneProject({ name: projectName });
  } catch (error) {
    console.error("Error fetching feedbackpost:", error);
  }

  if (!feedbackpost?.id || !project) {
    return notFound();
  }

  const feedbackBoards = project.feedbackBoards as unknown as IFeedbackBoard[];

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
        <FeedbackHeader title="Roadmap" />
        <div className="flex flex-1">
          <div className="min-w-0 flex-1 border-t border-gray-200 xl:flex">
            <FeedbackPublicSideNav feedbackBoards={feedbackBoards} />

            <FeedbackDetailContainer
              feedbackBoards={feedbackBoards}
              feedbackPost={feedbackpost}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
