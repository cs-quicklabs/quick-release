import { classNames } from "@/lib/utils";
import { FeedbackPostType } from "@/types";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

export default function FeedbackCard({
  feedback,
}: {
  feedback: FeedbackPostType;
}) {
  return (
    <>
      <h1 className="text-base font-medium text-gray-900">{feedback.title}</h1>
      <div className="mt-2 flex items-center gap-2">
        <span
          className={classNames(
            "inline-flex items-center bg-gray-100 rounded px-2 py-0.5 text-xs font-medium text-gray-800 mr-1"
          )}
        >
          {feedback.feedbackBoards?.name}
        </span>

        <div
          className={`flex items-end rounded px-1.5 py-0.5 text-xs font-medium border cursor-pointer ${
            feedback.isUpvoted
              ? "border-green-500 text-green-500 bg-green-50"
              : "border-gray-300"
          }`}
        >
          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          <span>{feedback?.upvotedCount}</span>
        </div>
      </div>
    </>
  );
}
