"use client";

import { FeedbackStatus, FeedbackVisibilityStatus } from "@/Utils/constants";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { Button } from "@/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import { classNames } from "@/lib/utils";
import { EllipsisVerticalIcon, InboxIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { IReleaseTag } from "@/interfaces";
import AlertModal from "@/components/AlertModal";
import { useProjectContext } from "@/app/context/ProjectContext";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import BeatLoader from "react-spinners/BeatLoader";

type PrevStateType = {
  isLoading: boolean;
  activeFeedbackPostId: string | null;
};

const FeedbackContentContainer = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const searchParams = useSearchParams();
  const [isUpvoteLoading, setIsUpvoteLoading] = useState(false);
  const search = useMemo(() => searchParams.get("search"), [searchParams]);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const prevStates = useRef<PrevStateType>({
    isLoading: false,
    activeFeedbackPostId: null,
  });

  const {
    activeFeedbackPostId,
    map: feedbackMap,
    isLoading,
    deleteFeedbackPost,
    upvoteFeedbackPost,
  } = useFeedbackPostContext();
  const { activeProjectId, map: projectMap } = useProjectContext();
  const feedback = feedbackMap[activeFeedbackPostId!];

  const releaseTags = feedback?.releaseTags
    ? (feedback?.releaseTags as IReleaseTag[]).map((tag) => ({
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
          sessionStorage.setItem("activeFeedbackPostId", activeFeedbackPostId!);
          router.push(`/feedback/${activeFeedbackPostId}`);
        },
      },
      {
        name: "Delete",
        id: "delete-feedback",
        onClick: () => setShowDeleteModal(true),
      },
    ],
    [feedback]
  );

  useEffect(() => {
    if (
      !activeFeedbackPostId ||
      (prevStates.current?.isLoading && !isLoading)
    ) {
      setLoading(false);
    }

    if (prevStates.current.activeFeedbackPostId !== activeFeedbackPostId) {
      contentContainerRef.current?.scroll({ top: 0, behavior: "smooth" });
    }

    return () => {
      prevStates.current = {
        isLoading,
        activeFeedbackPostId,
      };
    };
  }, [activeFeedbackPostId, isLoading]);

  if (!feedback) {
    return (
      <section
        className="flex w-full h-1/2 items-center justify-center"
        aria-labelledby="message-heading"
      >
        <div className="text-center">
          <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />

          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            {search ? "No results found" : "No Item Selected"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {search
              ? "Sorry, no results match your search criteria. Please adjust your search keyword and try again."
              : "Please select an item from the left list to view details here."}
          </p>
        </div>
      </section>
    );
  }
  const {
    id,
    title,
    description,
    status,
    feedbackBoards,
    releaseETA,
    createdBy,
  } = feedback;

  const fullName = `${createdBy?.firstName || ""} ${
    createdBy?.lastName || ""
  }`.trim();
  const feedbackStatus = FeedbackStatus[status];
  const createdAt = feedback.createdAt
    ? moment(feedback.createdAt).format("MMMM DD, YYYY")
    : "";
  const ETA = releaseETA ? moment(releaseETA).format("DD/MM/YYYY") : undefined;
  const visibilityStatus = FeedbackVisibilityStatus[feedback.visibilityStatus!];

  const publicLink = `${projectMap[activeProjectId!]?.name}/feedbacks/${id}`;

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
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-medium text-gray-900">{title}</h1>
                <span
                  className={classNames(
                    "inline-flex items-center rounded px-3 py-0.5 text-sm font-medium",
                    `${visibilityStatus?.bgColor} ${visibilityStatus?.textColor}`
                  )}
                >
                  {visibilityStatus?.title}
                </span>
                {visibilityStatus.id === "public" && (
                  <Link href={publicLink}>
                    <ArrowUpRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                )}
              </div>

              <p className="mt-1 truncate text-sm text-gray-500 flex items-center">
                {`Created by ${fullName} on ${createdAt}`}{" "}
                {ETA && `| ETA: ${ETA}`}
              </p>
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
                  feedback.isUpvoted
                    ? "border-green-500 text-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
                onClick={() =>
                  upvoteFeedbackPost(
                    feedback.id!,
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
                    {feedback?.upvotedCount}
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
          </div>
        </div>

        <ul
          role="list"
          className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 sm:px-6 lg:px-8"
          data-svelte-h="svelte-1g1nf9v"
        >
          <li className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6">
            <span
              className={classNames(
                "inline-flex items-center bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-gray-800 mr-1"
              )}
            >
              {feedbackBoards?.name}
            </span>

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
          sessionStorage.removeItem("activeFeedbackPostId");
          deleteFeedbackPost(activeFeedbackPostId!, activeProjectId!);
          setShowDeleteModal(false);
        }}
        onClickCancel={() => setShowDeleteModal(false)}
        loading={isLoading}
      />
    </section>
  );
};

export default FeedbackContentContainer;
