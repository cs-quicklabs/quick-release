"use client";
import { getAllPublicFeedbacksRequest } from "@/fetchHandlers/feedbacks";
import { FeedbackPostType, FilterType } from "@/types";
import { FeedbackStatus } from "@/Utils/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import FeedbackCard from "@/app/(unauth)/roadmap/components/FeedbackCard";
import { classNames } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function RoadmapColumn(
  {status}: {status: string}) {
  const { bulletColor, title, bgColor, textColor } = FeedbackStatus[status];
  const { projectName } = useParams();
  const searchParams = useSearchParams();
  const [feedbackPosts, setFeedbackPosts] = useState<FeedbackPostType[]>([]);
  const router = useRouter();
  const board = useMemo(() => {
    const data = searchParams.get("board");
    if (data && data !== "") {
      return decodeURIComponent(searchParams.get("board") as string);
    }
    return null;
  }, [searchParams]);

  const fetchFeedbacksByStatus = useCallback(async (board: string) => {
    const query: FilterType = {
      feedbackStatus: status,
      projectName: projectName,
      skipStatus: true,
    };

    if(board) {
      query.board = board
    }
    const res = await getAllPublicFeedbacksRequest(query);
    const data = res.data.data;

    setFeedbackPosts(data?.feedbackPosts);
  }, [projectName, status]);

  useEffect(() => {
    if (projectName && status) {
      fetchFeedbacksByStatus(board!);
    }
  }, [status, projectName, board]);

  const publicLink = `${projectName}/roadmap`;

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
            onClick={() => router.push(`/${publicLink}/${feedbackPost.id}`)}
          >
            <FeedbackCard feedback={feedbackPost} />
          </li>
        ))}
      </ul>
    </section>
  );
}
