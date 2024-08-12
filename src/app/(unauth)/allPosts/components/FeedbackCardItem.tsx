import { FeedbackStatus } from "@/Utils/constants";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { classNames } from "@/lib/utils";
import { FeedbackPostType } from "@/types";
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

  const { createdBy, status, releaseETA, feedbackBoards } = feedback;
  const fullName = `${createdBy?.firstName || ""} ${
    createdBy?.lastName || ""
  }`.trim();
  const feedbacktatus = FeedbackStatus[status];
  const description = feedback.description.replace(/(<([^>]+)>)/gi, "");

  return (
    <li
      className={classNames(
        "relative py-5 px-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50",
        id === activeFeedbackPostId ? "bg-gray-50" : "bg-white"
      )}
      onClick={() => setActiveFeedbackPostId(id!)}
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
            <p className="truncate text-sm font-medium text-gray-900">
              {feedback.title}
            </p>
            <p className="flex truncate text-sm text-gray-500">
              <span className="truncate flex-shrink mr-1">{fullName}</span>

              <span>
                {` on ${
                  releaseETA
                    ? moment(releaseETA).format("MMMM DD, yyyy")
                    : "N/A"
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
        <span
          className={classNames(
            `inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium`,
            feedbacktatus.bgColor,
            feedbacktatus.textColor
          )}
        >
          {feedbacktatus.title}
        </span>
      )}
    </li>
  );
};

export default FeedbackCardItem;
