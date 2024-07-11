"use client";

import AlertModal from "../AlertModal";
import { ChangeLogsStatus } from "@/Utils/constants";
import { useChangeLogContext } from "@/app/context/ChangeLogContext";
import Alert, { AlertPropsType } from "@/components/Alert";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IReleaseCategory, IReleaseTag } from "@/interfaces";
import { classNames } from "@/lib/utils";
import {
  EllipsisVerticalIcon,
  ArrowUpRightIcon,
  InboxIcon,
} from "@heroicons/react/20/solid";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

type PrevStateType = {
  isLoading: boolean;
  activeChangeLogId: string | null;
};

const ContentContainer = () => {
  const router = useRouter();
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const prevStates = useRef<PrevStateType>({
    isLoading: false,
    activeChangeLogId: null,
  });

  const {
    activeChangeLogId,
    map: changelogMap,
    publishNowOneChangeLog,
    toggleArchiveOneChangeLog,
    deleteOneChangeLog,
  } = useChangeLogContext();
  const changelog = changelogMap[activeChangeLogId!];

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToggleArchivedModal, setShowToggleArchivedModal] = useState(false);
  const [showPublishNowModal, setShowPublishNowModal] = useState(false);

  useEffect(() => {
    if (!activeChangeLogId || (prevStates.current?.isLoading && !isLoading)) {
      setIsLoading(false);
      setShowDeleteModal(false);
      setShowToggleArchivedModal(false);
      setShowPublishNowModal(false);
    }

    if (prevStates.current.activeChangeLogId !== activeChangeLogId) {
      contentContainerRef.current?.scroll({ top: 0, behavior: "smooth" });
    }

    return () => {
      prevStates.current = {
        isLoading,
        activeChangeLogId,
      };
    };
  }, [activeChangeLogId, isLoading]);

  const alertDetails = useMemo<AlertPropsType | null>(() => {
    if (!changelog) return null;

    const { status, createdBy, project } = changelog;
    const fullName = `${createdBy?.firstName || ""} ${
      createdBy?.lastName || ""
    }`.trim();
    const scheduledTime = changelog.scheduledTime
      ? moment(changelog.scheduledTime).format("MMMM DD, YYYY")
      : "";
    const updatedAt = changelog.updatedAt
      ? moment(changelog.updatedAt).format("MMMM DD, YYYY")
      : "";
    const archivedAt = changelog.archivedAt
      ? moment(changelog.archivedAt).format("MMMM DD, YYYY")
      : "";
    const publicLink = `/${project?.name}/changelogs/${activeChangeLogId}`;
    const editChangeLogLink = `/changeLog/${activeChangeLogId}`;
    const changeLogStatus = archivedAt
      ? ChangeLogsStatus.archived
      : ChangeLogsStatus[status];
    const logStatus = changeLogStatus?.id;

    switch (logStatus) {
      case "published": {
        return {
          message: `${fullName} published this changelog on ${scheduledTime}`,
          actionText: "See Details",
          actionLink: publicLink,
          containerClassName: "bg-green-50 shadow-green",
          iconClassName: "text-green-400",
          messageClassName: "text-green-700",
          actionClassName: "text-green-700 hover:text-green-600",
        };
      }

      case "draft": {
        return {
          message: `${fullName} created this draft on ${updatedAt}`,
          actionText: "Continue Editing",
          actionLink: editChangeLogLink,
          containerClassName: "bg-yellow-50 shadow-yellow",
          iconClassName: "text-yellow-400",
          messageClassName: "text-yellow-700",
          actionClassName: "text-yellow-700 hover:text-yellow-600",
        };
      }

      case "scheduled": {
        return {
          message: `${fullName} will publish this changelog on ${scheduledTime}`,
          actionText: "Publish Now",
          onClickAction: () => setShowPublishNowModal(true),
          containerClassName: "bg-gray-100 shadow-gray",
          iconClassName: "text-gray-400",
          messageClassName: "text-gray-700",
          actionClassName: "text-gray-700 hover:text-gray-600",
        };
      }

      case "archived": {
        return {
          message: `${fullName} archived this changelog on ${archivedAt}`,
          actionText: "Unarchive",
          onClickAction: () => setShowToggleArchivedModal(true),
          containerClassName: "bg-red-50 shadow-red",
          iconClassName: "text-red-400",
          messageClassName: "text-red-700",
          actionClassName: "text-red-700 hover:text-red-600",
        };
      }

      default:
        return null;
    }
  }, [changelog]);

  const actionOptions = useMemo(
    () => [
      {
        name: "Edit",
        onClick: () => {
          router.push(`/changeLog/${activeChangeLogId}`);
        },
      },
      {
        name: changelog?.archivedAt ? "Unarchive" : "Archive",
        onClick: () => setShowToggleArchivedModal(true),
      },
      {
        name: "Delete",
        onClick: () => setShowDeleteModal(true),
      },
    ],
    [changelog]
  );

  if (!changelog) {
    return (
      <section
        className="flex w-full h-1/2 items-center justify-center"
        aria-labelledby="message-heading"
      >
        <div className="text-center">
          <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />

          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No Item Selected
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please select an item from the left list to view details here.
          </p>
        </div>
      </section>
    );
  }
  const {
    title,
    description,
    status,
    releaseVersion,
    archivedAt,
    createdBy,
    project,
  } = changelog;
  const releaseCategories = (
    changelog.releaseCategories as IReleaseCategory[]
  ).map((tag) => ({ value: tag.code, label: tag.name, bgColor: tag.bgColor, textColor: tag.textColor }));
  const releaseTags = (changelog.releaseTags as IReleaseTag[]).map((tag) => ({
    value: tag.code,
    label: tag.name,
  }));

  const fullName = `${createdBy?.firstName || ""} ${
    createdBy?.lastName || ""
  }`.trim();
  const changeLogStatus = archivedAt
    ? ChangeLogsStatus.archived
    : ChangeLogsStatus[status];
  const createdAt = changelog.createdAt
    ? moment(changelog.createdAt).format("MMMM DD, YYYY")
    : "";
  const publicLink = `/${project?.name}/changelogs/${activeChangeLogId}`;

  return (
    <section
      className="flex h-full min-w-0 flex-1 flex-col overflow-hidden xl:order-last"
      aria-labelledby="message-heading"
    >
      <div
        ref={contentContainerRef}
        className="flex-1 overflow-y-auto pb-10 no-scrollbar"
      >
        <div className="bg-white pt-5 pb-6 shadow border-b border-gray-200">
          <div className="px-4 sm:flex sm:items-baseline sm:justify-between sm:px-6 lg:px-8">
            <div className="sm:w-0 sm:flex-1" data-svelte-h="svelte-4musx2">
              <div className="flex items-center">
                <h1 className="text-lg font-medium text-gray-900">{title}</h1>

                <Link href={publicLink}>
                  <ArrowUpRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <p className="mt-1 truncate text-sm text-gray-500">
                Created by {fullName} on {createdAt}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
              <p className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500 mr-2">
                Version {releaseVersion}
              </p>

              <span
                className={classNames(
                  "inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium",
                  `${changeLogStatus?.bgColor} ${changeLogStatus?.textColor}`
                )}
              >
                {changeLogStatus?.title}
              </span>

              <div className="relative ml-3 inline-block text-left">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="-my-2 flex items-center rounded-full bg-white p-2 text-gray-400 hover:text-gray-600"
                      variant="default"
                      size="icon"
                    >
                      <EllipsisVerticalIcon
                        name="Open options"
                        className="h-5 w-5"
                      />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="bg-white">
                    {actionOptions.map((option) => (
                      <DropdownMenuItem
                        className="cursor-pointer bg-white hover:bg-gray-100"
                        key={option.name}
                        onClick={option.onClick}
                      >
                        {option.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <ul
          role="list"
          className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 sm:px-6 lg:px-8"
          data-svelte-h="svelte-1g1nf9v"
        >
          <li className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6">
            {releaseCategories.map(({ value, label, bgColor, textColor }) => (
              <span
                key={value}
                className={classNames(
                  "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium text-gray-800 mr-1"
                )}
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                {label}
              </span>
            ))}

            <div
              className={classNames(
                "space-y-6 text-sm text-gray-800 mt-4 ql-snow"
              )}
            >
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </li>
          {!!releaseTags.length && (
            <li className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6">
              <div className="sm:flex sm:items-baseline sm:justify-between">
                <h3 className="text-base font-medium">
                  <span className="text-gray-900">Release Tags</span>
                </h3>
              </div>

              <div className="space-y-2 text-sm text-gray-800">
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
            </li>
          )}

          {alertDetails && <Alert {...alertDetails} />}

          <li className="bg-transparent p-4" />
        </ul>
      </div>

      <AlertModal
        show={showDeleteModal}
        title="Delete change log"
        message={
          changeLogStatus?.id === "published"
            ? "This is change log is in Public view. Are you sure you want to delete it?"
            : "Are you sure you want to delete this change log?"
        }
        okBtnClassName="bg-red-600 hover:bg-red-800"
        spinClassName="!fill-red-600"
        onClickOk={() => deleteOneChangeLog(activeChangeLogId!, setIsLoading)}
        onClickCancel={() => setShowDeleteModal(false)}
        loading={isLoading}
      />

      <AlertModal
        show={showToggleArchivedModal}
        title={`${archivedAt ? "Unarchive" : "Archive"} change log`}
        message={
          changeLogStatus?.id === "published"
            ? "This is change log is in Public view. Are you sure you want to archive it?"
            : `Are you sure you want to ${
                archivedAt ? "unarchive" : "archive"
              } this change log?`
        }
        onClickCancel={() => setShowToggleArchivedModal(false)}
        onClickOk={() =>
          toggleArchiveOneChangeLog(activeChangeLogId!, setIsLoading)
        }
        loading={isLoading}
      />

      <AlertModal
        show={showPublishNowModal}
        title="Publish change log"
        message="Are you sure you want to publish now this change log?"
        onClickCancel={() => setShowPublishNowModal(false)}
        onClickOk={() =>
          publishNowOneChangeLog(activeChangeLogId!, setIsLoading)
        }
        loading={isLoading}
        modalSize="xl"
      />
    </section>
  );
};

export default ContentContainer;
