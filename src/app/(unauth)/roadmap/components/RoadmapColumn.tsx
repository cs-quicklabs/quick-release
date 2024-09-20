import { getAllFeedbackPostsRequest } from "@/fetchHandlers/feedbacks";
import { FeedbackPostType } from "@/types";
import { FeedbackStatus } from "@/Utils/constants";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import FeedbackCard from "./FeedbackCard";
import { classNames } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Draggable } from "@hello-pangea/dnd";
import { useOnScreen } from "@/hooks/useOnScreen";
import Spin from "@/atoms/Spin";
import { Button } from "@/atoms/button";
import { requestHandler } from "@/Utils";

type RoadmapColumnPropsType = {
  status: string;
  projectsId: string;
  feedbackStatusMap: { [key: string]: FeedbackPostType[] };
  setFeedbackStatusMap: any;
  feedbackCount: { [key: string]: number };
};

export default function RoadmapColumn({
  status,
  projectsId,
  feedbackStatusMap,
  setFeedbackStatusMap,
  feedbackCount,
}: RoadmapColumnPropsType) {
  const loadMoreRef = useRef<HTMLLIElement | null>(null);
  const isVisible = useOnScreen(loadMoreRef);
  const { bulletColor, title, bgColor, textColor } = FeedbackStatus[status];
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch feedbacks by status and stored in statusMap when needed more paginated data to fetch
  const fetchMoreFeedbacks = useCallback(async () => {
    if (loading || !hasMore) return; // Prevent multiple calls
    await requestHandler(
      async () =>
        await getAllFeedbackPostsRequest({
          feedbackStatus: status,
          projectsId: projectsId,
          page,
          limit: 10,
        }),
      setLoading,
      (response: any) => {
        const { data } = response;
        setFeedbackStatusMap(
          (prevMap: { [key: string]: FeedbackPostType[] }) => {
            const existingIds = new Set(
              prevMap[status]?.map((post) => post.id)
            );
            const newPosts = data.feedbackPosts.filter(
              (post: { id: string | undefined }) => !existingIds.has(post.id)
            );

            return {
              ...prevMap,
              [status]: [...(prevMap[status] || []), ...newPosts],
            };
          }
        );

        setHasMore(data.hasNextPage);
        if (data.hasNextPage) setPage((prev) => prev + 1);
      },
      (err: any) => {
        console.error("Error fetching feedback posts:", err);
      }
    );
  }, [loading, hasMore, status, projectsId, setFeedbackStatusMap]);

  useEffect(() => {
    if (isVisible) {
      fetchMoreFeedbacks();
    }
  }, [isVisible, fetchMoreFeedbacks]);

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
              {feedbackCount[status] || 0}
            </span>
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 overflow-y-auto no-scrollbar"
      >
        {feedbackStatusMap[status]?.map(
          (feedbackPost: FeedbackPostType, index: number) => (
            <Draggable
              key={feedbackPost.id}
              index={index}
              draggableId={feedbackPost.id!}
            >
              {(provided) => (
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
        <li
          ref={loadMoreRef}
          key={"loadMore"}
          className={classNames(
            "relative py-4 px-6 bg-white",
            !loading && hasMore ? "visible" : "hidden"
          )}
        >
          <Button
            className="w-full inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={fetchMoreFeedbacks}
          >
            {"Load More"}
          </Button>
        </li>

        {loading && (
          <li key={"loading"} className="relative py-5 bg-white">
            <div className="flex items-center justify-center">
              <Spin className="h-5 w-5 mr-2" />
              <span>Loading...</span>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}
