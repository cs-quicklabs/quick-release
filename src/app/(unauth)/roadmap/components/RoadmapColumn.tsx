import { getAllFeedbackPostsRequest } from "@/fetchHandlers/feedbacks";
import { FeedbackPostType, FilterType } from "@/types";
import { FeedbackStatus } from "@/Utils/constants";
import { useCallback, useEffect, useState } from "react";
import FeedbackCard from "./FeedbackCard";
import { classNames } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Draggable } from "@hello-pangea/dnd";

type RoadmapColumnPropsType = {
  status: string;
  projectsId: string;
  feedbackStatusMap: { [key: string]: FeedbackPostType[] };
  setFeedbackStatusMap: any;
};

export default function RoadmapColumn({
  status,
  projectsId,
  feedbackStatusMap,
  setFeedbackStatusMap,
}: RoadmapColumnPropsType) {
  const { bulletColor, title, bgColor, textColor } = FeedbackStatus[status];
  const router = useRouter();

  const fetchFeedbacksByStatus = useCallback(async () => {
    const query: FilterType = {
      projectsId: projectsId,
      feedbackStatus: status,
      skipLimit: true,
    };
    const res = await getAllFeedbackPostsRequest(query);
    const data = res.data.data;

    setFeedbackStatusMap((prev: any) => ({
      ...prev,
      [status]: data?.feedbackPosts,
    }));
  }, [projectsId, status]);

  useEffect(() => {
    if (projectsId && status) {
      fetchFeedbacksByStatus();
    }
  }, [status, projectsId]);

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
              {feedbackStatusMap[status]?.length || 0}
            </span>
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 overflow-y-auto no-scrollbar"
        data-svelte-h="svelte-1g1nf9v"
      >
        {feedbackStatusMap[status]?.map(
          (feedbackPost: FeedbackPostType, index: number) => (
            <Draggable
              key={feedbackPost.id}
              index={index}
              draggableId={feedbackPost.id!}
            >
              {(provided, snapshot) => (
                <li
                  className={classNames(
                    "bg-white px-4 py-4 shadow sm:rounded-lg sm:py-5 sm:px-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50 cursor-pointer"
                  )}
                  onClick={() =>
                    router.push(`/roadmap/feedback/${feedbackPost.id}`)
                  }
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <FeedbackCard feedback={feedbackPost} />
                </li>
              )}
            </Draggable>
          )
        )}
      </ul>
    </section>
  );
}
