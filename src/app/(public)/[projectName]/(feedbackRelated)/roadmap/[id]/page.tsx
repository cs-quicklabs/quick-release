import React from "react";
import moment from "moment";
import { REVALIDATE_API, WEB_DETAILS } from "@/Utils/constants";
import { notFound } from "next/navigation";
import { FeedbackPostType } from "@/types";
import { Metadata, ResolvingMetadata } from "next";
import FeedbackHeader from "../../components/FeedbackHeader";
import FeedbackPublicSideNav from "../../components/FeedbackPublicSideNav";
import { getOneProject } from "@/lib/project";
import FeedbackDetailContainer from "../../feedbacks/components/FeedbackDetailContainer";
import { IFeedbackBoard } from "@/interfaces";

type PagePayloadType = {
  params: {
    projectName: string;
    id: string;
  };
};

const getOneFeedbackPostDetails = async (
  projectName: string,
  id: string
): Promise<FeedbackPostType | null> => {
  return fetch(
    `${process.env.BASEURL}/api/public/projects/${projectName}/feedbacks/${id}`,
    { next: { revalidate: REVALIDATE_API } }
  )
    .then((response) => response.json())
    .then((resData) => (resData.success ? resData.data : null))
    .catch(() => null);
};

export async function generateMetadata(
  { params }: PagePayloadType,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id, projectName } = params;

  let feedbackpost;
  try {
    feedbackpost = await getOneFeedbackPostDetails(projectName, id);
  } catch (error) {
    console.error("Error fetching feedbackpost:", error);
  }

  if (!feedbackpost?.id) {
    return { title: "FeedbackPost Not Found" };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const fullName = `${feedbackpost.createdBy?.firstName || ""} ${
    feedbackpost.createdBy?.lastName || ""
  }`.trim();
  const date = moment(feedbackpost.createdAt).format("MMMM DD, YYYY");
  const ogDesc = `Published on ${date} - ${fullName}`;

  return {
    title: feedbackpost.title,
    description: ogDesc,
    openGraph: {
      title: feedbackpost.title,
      description: ogDesc,
      images: [
        `${process.env.BASEURL}/api/ogImage?title=${feedbackpost.title}&description=${ogDesc}`,
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
  );
};

export default Page;
