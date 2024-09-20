import { FeedbackStatus, FeedbackVisibilityStatus } from "@/Utils/constants";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { classNames } from "@/lib/utils";
import { FeedbackPostType } from "@/types";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import Link from "next/link";
import React, { useMemo } from "react";

const FeedbackCardItem: React.FC<{ id?: string | null }> = ({ id = null }) => {
  const { activeFeedbackPostId, map, setActiveFeedbackPostId } =
    useFeedbackPostContext();
  const feedback = useMemo<FeedbackPostType | null | undefined>(
    () => map[id!],
    [map, id]
  );

  if (!feedback) return null;

  const {
    createdBy,
    status,
    releaseETA,
    feedbackBoards,
    createdAt,
    visibilityStatus,
  } = feedback;
  const fullName = `${createdBy?.firstName || ""} ${
    createdBy?.lastName || ""
  }`.trim();
  const feedbacktatus = FeedbackStatus[status];
  const description = feedback.description.replace(/(<([^>]+)>)/gi, "");
  const feedbackVisibilityStatus = FeedbackVisibilityStatus[visibilityStatus!];

  return (
    <li
      className={classNames(
        "relative py-5 px-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50",
        id === activeFeedbackPostId ? "bg-gray-50" : "bg-white"
      )}
      id="postList"
      onClick={() => {
        sessionStorage.removeItem("activeFeedbackPostId");
        setActiveFeedbackPostId(id!);
      }}
    >
      <div className="flex justify-between space-x-3">
        <div className="min-w-0 flex-1">
          <Link
            className="block focus:outline-none"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <span
              className={classNames(
                "inline-flex items-center bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-gray-800 mr-1"
              )}
            >
              {feedbackBoards?.name}
            </span>
            <div className="flex justify-between">
              <p className="truncate text-sm font-medium text-gray-900">
                {feedback.title}
              </p>
              <span
                className={classNames(
                  "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium",
                  `${feedbackVisibilityStatus?.bgColor} ${feedbackVisibilityStatus?.textColor}`
                )}
              >
                {feedbackVisibilityStatus?.title}
              </span>
            </div>
            <p className="flex truncate text-sm text-gray-500">
              <span className="truncate flex-shrink mr-1">{fullName}</span>

              <span>
                {` on ${
                  createdAt ? moment(createdAt).format("MMMM DD, yyyy") : "N/A"
                }`}
              </span>
            </p>
          </Link>
        </div>
      </div>

      <div className="mt-1">
        <p
          className="text-sm text-gray-600 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {feedbacktatus && (
        <div className="mt-2 flex items-center justify-between">
          <span
            className={classNames(
              `inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium`,
              feedbacktatus.bgColor,
              feedbacktatus.textColor
            )}
          >
            {feedbacktatus.title}
          </span>

          <div
            className={`flex items-end rounded px-1.5 py-0.5 text-xs font-medium border cursor-pointer ${
              feedback.isUpvoted
                ? "border-green-500 text-green-500 bg-green-50"
                : "border-gray-300"
            }`}
          >
            <ChevronUpIcon className="h-4 w-4" />
            <span>{feedback?.upvotedCount}</span>
          </div>
        </div>
      )}
    </li>
  );
};

export default FeedbackCardItem;
