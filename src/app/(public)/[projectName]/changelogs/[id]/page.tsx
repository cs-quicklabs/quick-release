import React from "react";
import Link from "next/link";
import moment from "moment";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { classNames } from "@/lib/utils";
import { notFound } from "next/navigation";
import { IReleaseCategory, IReleaseTag } from "@/interfaces";
import { Metadata, ResolvingMetadata } from "next";
import { Navbar } from "@/components/Navbar";
import { getOneProject } from "@/lib/project";
import { PagePayloadType } from "@/types";
import { getOneChangeLogDetails } from "@/lib/changeLog";
import { WEB_DETAILS } from "@/Utils/constants";

export async function generateMetadata(
  { params }: PagePayloadType,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id, projectName } = params;

  let changelog;
  let project;
  try {
    project = await getOneProject({ name: projectName });
    changelog = await getOneChangeLogDetails(projectName, id);
  } catch (error) {
    console.error("Error fetching changelog:", error);
  }

  if (!project) {
    return { title: "Project Not Found" };
  }

  const logo = project.projectImgUrl?.split("/").slice(-2).join("/");

  if (!changelog?.id) {
    return { title: "changelog Not Found" };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const fullName = `${changelog.createdBy?.firstName || ""} ${
    changelog.createdBy?.lastName || ""
  }`.trim();
  const date = moment(changelog.createdAt).format("MMMM DD, YYYY");
  const ogDesc = `Changelog published on ${date} - ${fullName}`;

  return {
    title: project.name,
    description: changelog.title + " - " + ogDesc,
    icons: [
      {
        rel: "icon",
        url: project.projectImgUrl || WEB_DETAILS.favicon,
      },
    ],
    openGraph: {
      title: changelog.title,
      description: ogDesc,
      url: `${process.env.BASEURL}/${projectName}/changelogs/${id}`,
      images: [
        `${process.env.BASEURL}/api/ogImage?title=${
          changelog.title
        }&description=${ogDesc}&teamName=${project.name}${
          logo ? "&logo=" + logo : ""
        }`,
      ],
    },
  };
}

const Page: React.FC<PagePayloadType> = async ({ params }) => {
  const { id, projectName } = params;

  let changelog;
  let project;
  try {
    changelog = await getOneChangeLogDetails(projectName, id);
    project = await getOneProject({ name: projectName });
  } catch (error) {
    console.error("Error fetching changelog:", error);
  }

  if (!changelog?.id || !project) {
    return notFound();
  }

  const { title, description, releaseVersion } = changelog;
  const releaseCategories = (
    changelog.releaseCategories as IReleaseCategory[]
  ).map((category) => ({ value: category.code, label: category.name }));
  const releaseTags = (changelog.releaseTags as IReleaseTag[]).map((tag) => ({
    value: tag.code,
    label: tag.name,
  }));
  const scheduledTime = changelog.scheduledTime
    ? moment(changelog.scheduledTime).format("MMMM DD, YYYY")
    : "";

  return (
    <div className="contents overflow-hidden">
      <div className={`fixed w-full top-0 bg-gray-50 z-10`}>
        <Navbar
          projectName={project.name!}
          projectImgUrl={project.projectImgUrl!}
          projectSlug={project.slug!}
        />
      </div>
      <main className="max-w-5xl mx-auto p-4 mt-14">
        <Link href={`/${projectName}/changelogs`}>
          <button
            className="mb-2 inline-flex items-center gap-x-1.5 shadow-sm px-2.5 rounded-md bg-white-600 py-1.5 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            type="button"
            id="see-all-changelogs"
          >
            <ArrowLeftIcon className="w-6 h-6" />
            {"See All Changelogs"}
          </button>
        </Link>

        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mt-4">
              {title}
            </h2>

            <p className="mt-1 truncate text-sm text-gray-500">{`Published on ${scheduledTime} as Version ${releaseVersion}`}</p>

            <div className="mt-1">
              {releaseCategories.map(({ value, label }) => (
                <span
                  key={value}
                  className={classNames(
                    "inline-flex items-center bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-gray-800 mr-1"
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="content-container space-y-6 text-sm text-gray-800 mt-4 ql-snow">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {!!releaseTags.length && (
          <div className="text-sm text-gray-800 mt-6">
            {releaseTags.map(({ value, label }) => (
              <span
                key={value}
                className={classNames(
                  "inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 mr-1"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Page;
