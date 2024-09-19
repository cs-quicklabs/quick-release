"use client";
import { getAllPublicFeedbacksRequest } from "@/fetchHandlers/feedbacks";
import { FeedbackPostType, FilterType } from "@/types";
import { FeedbackStatus } from "@/Utils/constants";
import { useCallback, useEffect, useState } from "react";
import FeedbackCard from "@/app/(unauth)/roadmap/components/FeedbackCard";
import { classNames } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type RoadmapColumnPropsType = {
  status: string;
  board: string;
};

export default function RoadmapColumn({
  status,
  board,
}: RoadmapColumnPropsType) {
  const { bulletColor, title, bgColor, textColor } = FeedbackStatus[status];
  const { projectName } = useParams();
  const [feedbackPosts, setFeedbackPosts] = useState<FeedbackPostType[]>([]);
  const router = useRouter();

  const fetchFeedbacksByStatus = useCallback(
    async (board: string) => {
      const query: FilterType = {
        feedbackStatus: status,
        projectName: projectName,
        skipStatus: true,
        board,
      };

      const res = await getAllPublicFeedbacksRequest(query);
      const data = res.data.data;

      setFeedbackPosts(data?.feedbackPosts);
    },
    [projectName, status]
  );

  useEffect(() => {
    if (projectName && status) {
      fetchFeedbacksByStatus(board!);
    }
  }, [status, projectName, board]);

  return (
    <section className="px-4 py-4">
      <div className="">
        <div
          className={`flex items-center justify-between py-2.5 px-4 ${bgColor} rounded-lg`}
        >
          <div className={`flex items-center gap-2`}>
            <span
              className={`h-2 w-2 rounded-full ${bulletColor}`}
              aria-hidden={true}
            />
            <span className={`text-base font-medium ${textColor}`}>
              {title}
            </span>
          </div>
          <div>
            <span className={`text-base font-medium ${textColor}`}>
              {feedbackPosts?.length || 0}
            </span>
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 overflow-y-auto no-scrollbar"
        data-svelte-h="svelte-1g1nf9v"
      >
        {feedbackPosts?.map((feedbackPost: FeedbackPostType, index: number) => (
          <li
            className={classNames(
              "bg-white px-4 py-4 shadow sm:rounded-lg sm:py-5 sm:px-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50 cursor-pointer"
            )}
            onClick={() =>
              router.push(
                `/${projectName}/roadmap/${feedbackPost.id}?board=${feedbackPost.feedbackBoards?.name}`
              )
            }
          >
            <FeedbackCard feedback={feedbackPost} />
          </li>
        ))}
      </ul>
    </section>
  );
}
