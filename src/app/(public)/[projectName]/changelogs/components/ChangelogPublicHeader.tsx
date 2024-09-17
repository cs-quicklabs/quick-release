"use client";
import { Navbar } from "@/components/Navbar";
import { Project } from "@/interfaces";
import { useState } from "react";
import SideNav from "./SideNav";
import ChangeLogsListContainer from "./ChangeLogsListContainer";
import { useUserContext } from "@/app/context/UserContext";

export default function ChangelogPublicHeader({ project }: { project: any }) {
  const [showMenuNav, setShowMenuNav] = useState(false);
  const { loggedInUser } = useUserContext();

  const releaseTags = project.organizations?.releaseTags.map(
    (tag: { name: any; code: any }) => ({
      label: tag.name,
      value: tag.code,
    })
  );
  const releaseCategories = project.organizations?.releaseCategories.map(
    (category: { name: any; code: any }) => ({
      label: category.name,
      value: category.code,
    })
  );
  return (
    <>
      <div className={`sticky top-0 bg-gray-50 z-10`}>
        <Navbar
          projectName={project.name!}
          projectImgUrl={project.projectImgUrl!}
          projectSlug={project.slug!}
          setShowMenuNav={setShowMenuNav}
        />
      </div>
      <div className="mx-auto max-w-7xl overflow-hidden lg:py-4 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-5">
          {!loggedInUser && (
            <div
              className={`lg:hidden lg:col-span-3 fixed bg-gray-50 z-10 w-full ${
                !showMenuNav ? "top-16" : "top-60"
              }`}
            >
              <SideNav
                releaseTags={releaseTags}
                releaseCategories={releaseCategories}
              />
            </div>
          )}
          <div className="hidden lg:block lg:col-span-3">
            <SideNav
              releaseTags={releaseTags}
              releaseCategories={releaseCategories}
            />
          </div>
          <div
            className={`${
              releaseCategories?.length || releaseTags?.length
                ? "mt-[16rem] lg:col-span-9"
                : "lg:col-span-12"
            } lg:mt-0 ${!loggedInUser && "mt-[16rem]"}`}
          >
            <ChangeLogsListContainer />
          </div>
        </div>
      </div>
    </>
  );
}
