"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useRef } from "react";
import { classNames } from "@/lib/utils";
import { IReleaseTag } from "@/interfaces";
import { ArrowBigLeftIcon } from "lucide-react";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { updateQueryParams } from "@/Utils";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { FeedbackStatus } from "@/Utils/constants";

type FeedbackDetailContainerPropsType = {
  feedbackBoards: any[];
  feedbackPost: any;
};

export default function FeedbackDetailContainer({
  feedbackBoards,
  feedbackPost,
}: FeedbackDetailContainerPropsType) {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const board = useMemo(() => {
    const data = searchParams.get("board");
    if (data && data !== "") {
      return searchParams.get("board");
    }
    return null;
  }, [searchParams]);

  const search = useMemo(() => {
    const data = searchParams.get("search");
    if (data && data !== "") {
      return searchParams.get("search");
    }
    return null;
  }, [searchParams]);

  const previousPath = useMemo(() => {
    let path = pathName;
    if (pathName.split("/").pop() !== "feedbacks") {
      path = pathName.split("/").slice(0, -1).join("/");
    }

    const queryParams = updateQueryParams(board, search, null);

    return queryParams ? `${path}?${queryParams}` : path;
  }, [pathName]);

  const releaseTags = feedbackPost?.releaseTags
    ? (feedbackPost?.releaseTags as IReleaseTag[]).map((tag) => ({
        value: tag.code,
        label: tag.name,
      }))
    : [];

  const feedbackStatus = FeedbackStatus[feedbackPost.status];

  return (
    <section
      className="flex h-full min-w-0 flex-1 flex-col overflow-hidden xl:order-last"
      aria-labelledby="message-heading"
    >
      <div className="flex-1 overflow-y-auto pb-10 no-scrollbar">
        <div className="bg-white py-4 shadow border-b border-gray-200">
          <div className="px-4 sm:flex sm:items-baseline sm:justify-between sm:px-6 lg:px-8">
            <div className="sm:w-0 sm:flex-1" data-svelte-h="svelte-4musx2">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-medium text-gray-900">
                  {board
                    ? board
                    : feedbackBoards.find((b) => b.isDefault)?.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <ul
          role="list"
          className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 sm:px-6 lg:px-8"
          data-svelte-h="svelte-1g1nf9v"
        >
          <li className="bg-white px-4 py-6 shadow sm:rounded-lg sm:px-6 flex justify-between">
            <div className="flex items-center gap-2">
              <ArrowLeftIcon
                className="w-4 h-4 cursor-pointer"
                onClick={() => router.back()}
              />
              <h1 className="text-lg font-medium text-gray-900">{feedbackPost?.title}</h1>
              <span
              className={classNames(
                `inline-flex items-center rounded px-3 py-0.5 text-sm font-medium`,
                feedbackStatus.bgColor,
                feedbackStatus.textColor
              )}
            >
              {feedbackStatus.title}
            </span>
            </div>
            <div>
              <span
                className={`flex items-center rounded px-2.5 py-0.5 text-sm font-medium border gap-2 ${
                  feedbackPost.isUpvoted
                    ? "border-green-500 text-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              >
                <ChevronUpIcon className="h-6 w-6" />
                {feedbackPost?.upvotedCount}
              </span>
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
                dangerouslySetInnerHTML={{ __html: feedbackPost?.description }}
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
    </section>
  );
}
