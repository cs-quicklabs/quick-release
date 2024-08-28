import { FeedbackStatus, FeedbackVisibilityStatus } from "@/Utils/constants";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { classNames } from "@/lib/utils";
import { FeedbackPostType } from "@/types";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import Link from "next/link";
import React, { useMemo } from "react";

const FeedbackCardItem: React.FC<{ feedback?: FeedbackPostType }> = ({
  feedback,
}) => {
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
        "py-5 px-6 border border-gray-200 rounded hover:bg-gray-50 bg-white"
      )}
    >
      <div className="flex justify-between space-x-3">
        <div className="min-w-0 flex-1">
          <div className="flex gap-2 mb-2">
            <span
              className={classNames(
                `inline-flex items-center rounded px-3 py-0.5 text-sm font-medium`,
                feedbacktatus.bgColor,
                feedbacktatus.textColor
              )}
            >
              {feedbacktatus.title}
            </span>
            <div
              className={`flex items-center rounded px-1.5 py-0.5 text-sm font-medium border cursor-pointer ${
                feedback.isUpvoted
                  ? "border-green-500 text-green-500 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              <ChevronUpIcon className="h-4 w-4" />
              <span>{feedback?.upvotedCount}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="truncate text-sm font-medium text-gray-900">
              {feedback.title}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-1">
        <p
          className="text-sm text-gray-600 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </li>
  );
};

export default FeedbackCardItem;
