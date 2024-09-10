import React from "react";
import Link from "next/link";
import moment from "moment";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { REVALIDATE_API, WEB_DETAILS } from "@/Utils/constants";
import { classNames } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ChangeLogType } from "@/types";
import { IReleaseCategory, IReleaseTag } from "@/interfaces";
import { Metadata, ResolvingMetadata } from "next";
import NavPublic from "@/components/NavPublic";

type PagePayloadType = {
  params: {
    projectName: string;
    id: string;
  };
};

const getOneChangeLogDetails = async (
  projectName: string,
  id: string
): Promise<ChangeLogType | null> => {
  return fetch(
    `${process.env.BASEURL}/api/public/projects/${projectName}/changelogs/${id}`,
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

  let changelog;
  try {
    changelog = await getOneChangeLogDetails(projectName, id);
  } catch (error) {
    console.error("Error fetching changelog:", error);
  }

  if (!changelog?.id) {
    return { title: "Changelog Not Found" };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const fullName = `${changelog.createdBy?.firstName || ""} ${
    changelog.createdBy?.lastName || ""
  }`.trim();
  const date = moment(changelog.createdAt).format("MMMM DD, YYYY");
  const ogDesc = `Published on ${date} as version ${changelog.releaseVersion} - ${fullName}`;

  return {
    title: changelog.title,
    description: ogDesc,
    openGraph: {
      title: changelog.title,
      description: ogDesc,
      images: [
        `${process.env.BASEURL}/api/ogImage?title=${changelog.title}&description=${ogDesc}`,
      ],
    },
  };
}

const Page: React.FC<PagePayloadType> = async ({ params }) => {
  const { id, projectName } = params;

  let changelog;
  try {
    changelog = await getOneChangeLogDetails(projectName, id);
  } catch (error) {
    console.error("Error fetching changelog:", error);
  }

  if (!changelog?.id) {
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
    <main className="max-w-5xl mx-auto p-4 mt-4">
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
  );
};

export default Page;
