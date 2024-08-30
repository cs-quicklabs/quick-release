import { Button } from "@/atoms/button";
import { getOneProject } from "@/lib/project";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import FeedbackPublicSideNav from "./components/FeedbackPublicSideNav";
import FeedbackPublicContentContainer from "./components/FeedbackPublicContentContainer";
import FeedbackHeader from "./components/FeedbackHeader";

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

  const feedbackBoards = project.feedbackBoards;

  return (
    <main className="flex flex-col">
      <FeedbackHeader />
      <div className="flex flex-1">
        <div className="min-w-0 flex-1 border-t border-gray-200 xl:flex">
          <FeedbackPublicSideNav feedbackBoards={feedbackBoards}  />

          <FeedbackPublicContentContainer feedbackBoards={feedbackBoards} projectName={projectName} />
        </div>
      </div>
    </main>
  );
};

export default Page;
