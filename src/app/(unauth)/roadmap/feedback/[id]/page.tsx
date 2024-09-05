"use client";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { useProjectContext } from "@/app/context/ProjectContext";
import { Button } from "@/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import Loader from "@/atoms/Loader";
import Loading from "@/atoms/Loading";
import ScreenLoader from "@/atoms/ScreenLoader";
import AlertModal from "@/components/AlertModal";
import { IReleaseTag } from "@/interfaces";
import { classNames } from "@/lib/utils";
import { FeedbackStatus, FeedbackVisibilityStatus } from "@/Utils/constants";
import {
  ArrowLeftIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import moment from "moment";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function Page() {
  const [loader, setLoader] = useState(false);
  const [isUpvoteLoading, setIsUpvoteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const {
    map: feedbackPostMap,
    isLoading,
    deleteFeedbackPost,
    upvoteFeedbackPost,
    getFeedbackPost,
  } = useFeedbackPostContext();
  const feedbackId = useParams()?.id as string;
  const { activeProjectId, getActiveProject } = useProjectContext();
  const fetchActiveProject = useCallback(async () => {
    if (!activeProjectId) {
      await getActiveProject(setLoader);
    }
  }, [activeProjectId]);

  const fetchFeedbackPost = useCallback(async () => {
    if (activeProjectId && feedbackId) {
      const query = { projectsId: activeProjectId };
      await getFeedbackPost(feedbackId, query);
    }
  }, [feedbackId, activeProjectId]);

  useEffect(() => {
    fetchActiveProject();
  }, [activeProjectId]);

  useEffect(() => {
    fetchFeedbackPost();
  }, [feedbackId, activeProjectId]);

  const feedbackPost = useMemo(() => {
    return feedbackPostMap[feedbackId!] || null;
  }, [feedbackPostMap[feedbackId!]]);

  const releaseTags = feedbackPost?.releaseTags
    ? (feedbackPost?.releaseTags as IReleaseTag[]).map((tag) => ({
        value: tag.code,
        label: tag.name,
      }))
    : [];

  const actionOptions = useMemo(
    () => [
      {
        name: "Edit",
        id: "edit-feedback",
        onClick: () => {
          router.push(`/feedback/${feedbackId}`);
        },
      },
      {
        name: "Delete",
        id: "delete-feedback",
        onClick: () => setShowDeleteModal(true),
      },
    ],
    [feedbackPost]
  );
  const title = feedbackPost?.title;
  const fullName = `${feedbackPost?.createdBy?.firstName || ""} ${
    feedbackPost?.createdBy?.lastName || ""
  }`.trim();
  const feedbackStatus = FeedbackStatus[feedbackPost?.status!];
  const createdAt = feedbackPost?.createdAt
    ? moment(feedbackPost?.createdAt).format("MMMM DD, YYYY")
    : "";
  const ETA = feedbackPost?.releaseETA
    ? moment(feedbackPost?.releaseETA).format("DD/MM/YYYY")
    : undefined;
  const visibilityStatus =
    FeedbackVisibilityStatus[feedbackPost?.visibilityStatus!];

  return (
    <main className="overflow-hidden border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-0 pt-10 pb-12 lg:pb-16">
        {!feedbackPost || isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <ul
            role="list"
            className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 sm:px-6 lg:px-8"
            data-svelte-h="svelte-1g1nf9v"
          >
            <li className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-8 flex justify-between">
              <div className="flex items-center gap-4">
                <ArrowLeftIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => router.back()}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-medium text-gray-900">
                      {title}
                    </h1>
                    <span
                      className={classNames(
                        "inline-flex items-center rounded px-3 py-0.5 text-sm font-medium",
                        `${visibilityStatus?.bgColor} ${visibilityStatus?.textColor}`
                      )}
                    >
                      {visibilityStatus?.title}
                    </span>
                    {/* <Link href={publicLink}>
                  <ArrowUpRightIcon className="w-4 h-4 ml-2" />
                </Link> */}
                  </div>

                  <p className="mt-1 truncate text-sm text-gray-500 flex items-center">
                    {`Created by ${fullName} on ${createdAt}`}{" "}
                    {ETA && `| ETA: ${ETA}`}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-evenly gap-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
                <span
                  className={classNames(
                    "inline-flex items-center rounded px-3 py-0.5 text-sm font-medium",
                    `${feedbackStatus?.bgColor} ${feedbackStatus?.textColor}`
                  )}
                >
                  {feedbackStatus?.title}
                </span>
                <span
                  className={`flex items-center rounded px-2.5 py-0.5 text-sm font-medium border gap-2 cursor-pointer ${
                    feedbackPost?.isUpvoted
                      ? "border-green-500 text-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  onClick={() =>
                    upvoteFeedbackPost(
                      feedbackPost?.id!,
                      activeProjectId!,
                      setIsUpvoteLoading
                    )
                  }
                >
                  {isUpvoteLoading ? (
                    <BeatLoader size={7} />
                  ) : (
                    <>
                      <ChevronUpIcon className="h-5 w-5" />
                      {feedbackPost?.upvotedCount}
                    </>
                  )}
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
                          id="open-options"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      {actionOptions.map((option) => (
                        <DropdownMenuItem
                          className="cursor-pointer bg-white hover:bg-gray-100"
                          id={option?.id}
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
            </li>
            <li className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6">
              <span
                className={classNames(
                  "inline-flex items-center bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-gray-800 mr-1"
                )}
              >
                {feedbackPost?.feedbackBoards?.name}
              </span>

              <div
                className={classNames(
                  "space-y-6 text-sm text-gray-800 mt-4 ql-snow"
                )}
              >
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{
                    __html: feedbackPost?.description!,
                  }}
                />
              </div>
            </li>
            {!!releaseTags.length && (
              <li className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6">
                <div className="sm:flex sm:items-baseline sm:justify-between pb-2">
                  <h3 className="text-base font-medium">
                    <span className="text-gray-900">{"Tags"}</span>
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
          </ul>
        )}
      </div>
      <AlertModal
        show={showDeleteModal}
        title="Delete feedback post"
        message={
          visibilityStatus?.id === "public"
            ? "This feedback is in public view. Are you sure you want to delete it?"
            : "Are you sure you want to delete this feedback?"
        }
        okBtnClassName="bg-red-600 hover:bg-red-800"
        spinClassName="!fill-red-600"
        onClickOk={() => {
          deleteFeedbackPost(feedbackId!, activeProjectId!);
          setShowDeleteModal(false);
          if(!isLoading) router.push("/roadmap");
        }}
        onClickCancel={() => setShowDeleteModal(false)}
        loading={isLoading}
      />
    </main>
  );
}
