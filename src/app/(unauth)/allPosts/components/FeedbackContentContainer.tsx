"use client";

import { useFeedbackBoardContext } from "@/app/context/FeedbackBoardContext";
import { FeedbackStatus } from "@/Utils/constants";
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
import React, { useEffect, useRef, useState } from "react";
import { CalendarDateRangeIcon } from "@heroicons/react/24/outline";

type PrevStateType = {
  isLoading: boolean;
  activeFeedbackPostId: string | null;
};

const FeedbackContentContainer = () => {
  const [loading, setLoading] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const prevStates = useRef<PrevStateType>({
    isLoading: false,
    activeFeedbackPostId: null,
  });

  const { activeFeedbackPostId, map: feedbackMap, isLoading } = useFeedbackPostContext();
  const feedback = feedbackMap[activeFeedbackPostId!];

  useEffect(() => {
    if(!activeFeedbackPostId || (prevStates.current?.isLoading && !isLoading)) {
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
            No Item Selected
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please select an item from the left list to view details here.
          </p>
        </div>
      </section>
    );
  }
  const { title, description, status, feedbackBoards, releaseETA, createdBy } =
    feedback;

  const fullName = `${createdBy?.firstName || ""} ${
    createdBy?.lastName || ""
  }`.trim();
  const feedbackStatus = FeedbackStatus[status];
  const createdAt = feedback.createdAt
    ? moment(feedback.createdAt).format("MMMM DD, YYYY")
    : "";
  const ETA = releaseETA ? moment(releaseETA).format("MMMM DD, YYYY") : undefined;

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
              </div>

              <p className="mt-1 truncate text-sm text-gray-500 flex items-center">
                {`Created by ${fullName} on ${createdAt} | ETA: `}{ETA ? ETA : <CalendarDateRangeIcon className="h-5 w-5 text-gray-400 cursor-pointer" />}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
              <span
                className={classNames(
                  "inline-flex items-center rounded px-3 py-0.5 text-sm font-medium",
                  `${feedbackStatus?.bgColor} ${feedbackStatus?.textColor}`
                )}
              >
                {feedbackStatus?.title}
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
          <li className="bg-transparent p-4" />
        </ul>
      </div>
    </section>
  );
};

export default FeedbackContentContainer;
