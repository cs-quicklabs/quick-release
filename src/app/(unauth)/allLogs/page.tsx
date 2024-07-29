"use client";


import BaseTemplate from "@/templates/BaseTemplate";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/dashboard/SideNav";
import { useProjectContext } from "@/app/context/ProjectContext";
import { useChangeLogContext } from "@/app/context/ChangeLogContext";
import EmptyPage from "@/components/dashboard/EmptyPage";
import ContentContainer from "@/components/dashboard/ContentContainer";
import { Button } from "@/atoms/button";
import { Bars3Icon } from "@heroicons/react/20/solid";
import ScreenLoader from "@/atoms/ScreenLoader";

export default function AllLogs() {
  const [loading, setLoading] = useState(false);
  const { activeProjectId, getActiveProject, isLoading: setActiveProjectLoading } = useProjectContext();
  const { isLoading: isFetchingChangeLogs, metaData, activeChangeLogId, list: changeLogsList, getAllChangeLogs } = useChangeLogContext();
  const [showSideNav, setShowSideNav] = useState(false);
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!activeProjectId) {
      getActiveProject(setLoading);
    }
  }, [activeProjectId]);

  useEffect(() => {
    if (activeProjectId) {
      const query = { projectId: activeProjectId };
      getAllChangeLogs(query);
    }
  }, [activeProjectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayed(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  // show loading if fetching current active project or change logs
  if ((!activeProjectId && loading) || (!metaData?.hasProjectChangeLogs && isFetchingChangeLogs) || setActiveProjectLoading) {
    return <ScreenLoader />;
  }

  const renderEmptyPage = () => {
    const emptyProps = activeProjectId
      ? {
        title: "No Changelog added.",
        description: "Get started by creating your first changelog post.",
        btnText: "New Changelog",
        navigateTo: "/changeLog/add",
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

  const prevQuery = metaData?.prevQuery;

  console.log(prevQuery)

  if ((!activeProjectId && !loading) || (!metaData?.hasProjectChangeLogs && !isFetchingChangeLogs) || (!prevQuery?.isDeleted && !prevQuery?.status && !prevQuery?.isArchived && !activeChangeLogId)) {
    return delayed ? renderEmptyPage() : <ScreenLoader />;
  }


  return (
    <BaseTemplate>
      <div className="flex h-full flex-col">
        <div className="md:flex md:items-center md:justify-between py-4 px-6" data-svelte-h="svelte-1a2r45a">
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <div className="xl:hidden mr-1">
                <Button
                  className="rounded-full text-gray-400 hover:text-gray-600"
                  variant="default"
                  size="icon"
                  onClick={() => setShowSideNav(true)}
                >
                  <Bars3Icon
                    name="Menu options"
                    className="h-5 w-5"
                  />
                </Button>
              </div>

              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{"Change Logs"}</h2>
            </div>
          </div>

          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link href="/changeLog/add">
              <button
                id="add-new"
                type="button"
                className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                {"Add New"}
              </button>
            </Link>
          </div>
        </div>

        <div className="h-full flex min-h-0 flex-1 overflow-hidden">
          <main className="min-w-0 flex-1 border-t border-gray-200 xl:flex">
            <SideNav
              showSideNav={showSideNav}
              setShowSideNav={setShowSideNav}
            />

            <ContentContainer />
          </main>
        </div>
      </div>
    </BaseTemplate>
  );
}
