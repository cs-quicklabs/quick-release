import { getAllFeedbackPostsRequest } from "@/fetchHandlers/feedbacks";
import { FeedbackPostType, FilterType } from "@/types";
import { FeedbackStatus } from "@/Utils/constants";
import { useCallback, useEffect, useState } from "react";
import FeedbackCard from "./FeedbackCard";
import { classNames } from "@/lib/utils";
import { useRouter } from "next/navigation";

type RoadmapColumnPropsType = {
  status: string;
  projectsId: string;
  feedbackStatusMap: { [key: string]: FeedbackPostType[] };
  setFeedbackStatusMap: (map: { [key: string]: FeedbackPostType[] }) => void;
};

export default function RoadmapColumn({
  status,
  projectsId,
  feedbackStatusMap,
  setFeedbackStatusMap,
}: RoadmapColumnPropsType) {
  const { bulletColor, title, bgColor, textColor } = FeedbackStatus[status];
  const [feedbacks, setFeedbacks] = useState<FeedbackPostType[]>([]);
  const router = useRouter();

  const fetchFeedbacksByStatus = useCallback(async () => {
    const query: FilterType = {
      projectsId: projectsId,
      feedbackStatus: status,
      skipStatus: true,
    };
    const res = await getAllFeedbackPostsRequest(query);
    const data = res.data.data;
    setFeedbacks(data?.feedbackPosts || []);
    if (data?.feedbackPosts?.length > 0) {
      setFeedbackStatusMap({
        ...feedbackStatusMap,
        [status]: data?.feedbackPosts || [],
      });
    }
  }, [projectsId, status]);

  useEffect(() => {
    if (projectsId && status) {
      fetchFeedbacksByStatus();
    }
  }, [status, projectsId]);

  return (
    <section className="w-[33rem] px-4 py-4">
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
              {feedbacks.length}
            </span>
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 overflow-y-auto no-scrollbar"
        data-svelte-h="svelte-1g1nf9v"
      >
        {feedbacks.map((feedbackPost: FeedbackPostType, index: number) => (
          <li
            className={classNames(
              "bg-white px-4 py-4 shadow sm:rounded-lg sm:py-5 sm:px-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50 cursor-pointer"
            )}
            onClick={() => router.push(`/roadmap/feedback/${feedbackPost.id}`)}
          >
            <FeedbackCard feedback={feedbackPost} />
          </li>
        ))}
      </ul>
    </section>
  );
}
