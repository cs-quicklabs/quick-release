"use client";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import SideNav from "./SideNav";
import ChangeLogsListContainer from "./ChangeLogsListContainer";
import { useUserContext } from "@/app/context/UserContext";
import { classNames } from "@/lib/utils";

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
      <div className={`fixed top-0 w-full bg-gray-50 z-999`}>
        <Navbar
          projectName={project.name!}
          projectImgUrl={project.projectImgUrl!}
          projectSlug={project.slug!}
          setShowMenuNav={setShowMenuNav}
        />
      </div>
      <div className="bg-white">
        <div
          className={classNames(
            "mx-auto max-w-7xl overflow-hidden lg:py-4 lg:px-8 ",
            loggedInUser ? "mt-14" : "mt-14 lg:mt-[116px]"
          )}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-5">
            {!loggedInUser && (
              <div
                className={`lg:hidden lg:col-span-3  bg-white z-10 w-full ${
                  !showMenuNav ? "top-14" : "top-60"
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
                  ? "lg:col-span-9"
                  : "lg:col-span-12"
              } lg:mt-0 `}
            >
              <ChangeLogsListContainer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
