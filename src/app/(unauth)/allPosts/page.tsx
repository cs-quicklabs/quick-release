"use client";

import BaseTemplate from "@/templates/BaseTemplate";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useProjectContext } from "@/app/context/ProjectContext";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import EmptyPage from "@/components/dashboard/EmptyPage";
import { Button } from "@/atoms/button";
import { Bars3Icon } from "@heroicons/react/20/solid";
import ScreenLoader from "@/atoms/ScreenLoader";
import FeedbackSideNav from "./components/FeedbackSideNav";
import FeedbackContentContainer from "./components/FeedbackContentContainer";

export default function AllPosts() {
  const [loading, setLoading] = useState(false);
  const {
    activeProjectId,
    getActiveProject,
    isLoading: setActiveProjectLoading,
  } = useProjectContext();
  const {
    isLoading: isFetchingFeedbacks,
    metaData,
    activeFeedbackPostId,
    list: feedbacks,
    getAllFeedbackPosts,
  } = useFeedbackPostContext();
  const [showSideNav, setShowSideNav] = useState(false);

  useEffect(() => {
    if (!activeProjectId) {
      getActiveProject(setLoading);
    }
  }, [activeProjectId]);

  useEffect(() => {
    if (activeProjectId) {
      const query = { projectId: activeProjectId! };
      getAllFeedbackPosts(query);
    }
  }, [activeProjectId]);

  // show loading if fetching current active project or feedbacks
  if (
    (!activeProjectId && loading) ||
    (!metaData?.total && isFetchingFeedbacks) ||
    setActiveProjectLoading
  ) {
    return <ScreenLoader />;
  }

  const renderEmptyPage = () => {
    const emptyProps = activeProjectId
      ? {
          title: "No Feedback added.",
          description: "Get started by creating your first feedback post.",
          btnText: "New Feedback",
          navigateTo: "/feedback/add",
        }
      : {
          title: "No Project added.",
          description: "Get started by creating your first project.",
          btnText: "New Project",
          navigateTo: "/create-project",
        };

    return (
      <BaseTemplate>
        <EmptyPage {...emptyProps} />
      </BaseTemplate>
    );
  };

  if (
    (!activeProjectId && !loading) ||
    (metaData.total === 0 && !isFetchingFeedbacks) ||
    (!feedbacks && !activeFeedbackPostId && !isFetchingFeedbacks)
  ) {
    return renderEmptyPage();
  }

  return (
    <BaseTemplate>
      <div className="flex h-full flex-col">
        <div
          className="md:flex md:items-center md:justify-between py-4 px-6"
          data-svelte-h="svelte-1a2r45a"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <div className="xl:hidden mr-1">
                <Button
                  className="rounded-full text-gray-400 hover:text-gray-600"
                  variant="default"
                  size="icon"
                  onClick={() => setShowSideNav(true)}
                >
                  <Bars3Icon name="Menu options" className="h-5 w-5" />
                </Button>
              </div>

              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {"Feedbacks"}
              </h2>
            </div>
          </div>

          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link href="/feedback/add">
              <button
                id="add-new"
                type="button"
                className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {"Add New"}
              </button>
            </Link>
          </div>
        </div>

        <div className="h-full flex min-h-0 flex-1 overflow-hidden">
          <main className="min-w-0 flex-1 border-t border-gray-200 xl:flex">
            <FeedbackSideNav
              showSideNav={showSideNav}
              setShowSideNav={setShowSideNav}
            />

            <FeedbackContentContainer />
          </main>
        </div>
      </div>
    </BaseTemplate>
  );
}
