"use client";

import React, { useEffect, useState } from "react";
import { useProjectContext } from "@/app/context/ProjectContext";
import RoadmapColumn from "./components/RoadmapColumn";
import Loading from "@/atoms/Loading";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { FeedbackPostType } from "@/types";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { getAllFeedbackPostsRequest } from "@/fetchHandlers/feedbacks";
import { requestHandler } from "@/Utils";

export default function AdminRoadmap() {
  const [activeProjectLoading, setActiveProjectLoading] = useState(false);
  const { updateFeedbackStatus, isLoading: isFetchingFeedback } =
    useFeedbackPostContext();
  const { activeProjectId, getActiveProject } = useProjectContext();
  const [feedbackCount, setFeedbackCount] = useState<{
    [key: string]: number;
  }>({});

  const feedbackStatus = ["IN_REVIEW", "PLANNED", "IN_PROGRESS"];

  const [feedbackStatusMap, setFeedbackStatusMap] = useState<{
    [key: string]: FeedbackPostType[];
  }>({});

  const [isLoading, setIsLoading] = useState(true);

  const [updateFeedbackLoading, setUpdateFeedbackLoading] = useState(false);

  useEffect(() => {
    if (!activeProjectId) {
      getActiveProject(setActiveProjectLoading);
    } else {
      fetchFeedbacksByStatus();
    }
  }, [activeProjectId]);

  // Fetch feedbacks by status and stored in statusMap
  const fetchFeedbacksByStatus = async () => {
    try {
      const statusMap: { [key: string]: FeedbackPostType[] } = {};
      const statusCountMap: { [key: string]: number } = {};

      await Promise.all(
        feedbackStatus.map(async (status) => {
          await requestHandler(
            async () =>
              await getAllFeedbackPostsRequest({
                feedbackStatus: status,
                projectsId: activeProjectId!,
                page: 1,
                limit: 10,
              }),
            setIsLoading,
            (response: any) => {
              const { data } = response;
              statusMap[status] = data.feedbackPosts;
              statusCountMap[status] = data.total;
            },
            (error: any) => {
              console.error("Error fetching feedback posts:", error);
            }
          );
        })
      );
      setFeedbackStatusMap(statusMap);
      setFeedbackCount(statusCountMap);
    } catch (error) {
      console.error("Error fetching feedback posts:", error);
    }
  };

  if (
    activeProjectLoading ||
    !activeProjectId ||
    Object.keys(feedbackStatusMap).length === 0 || isLoading
  ) {
    return (
      <main className="overflow-hidden border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 lg:px-0 pt-10 pb-12 lg:pb-16">
          <Loading />
        </div>
      </main>
    );
  }

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    const items = { ...feedbackStatusMap };
    const [movedItem] = items[source.droppableId].splice(source.index, 1);
    items[destination.droppableId].splice(destination.index, 0, movedItem);

    const feedbackUpdate = {
      id: draggableId,
      status: destination.droppableId,
      projectsId: activeProjectId!,
    };

    // Update feedback status via API and locally in the state
    updateFeedbackStatus(feedbackUpdate, setUpdateFeedbackLoading);

    // Update feedback count
    const newFeedbackCount = {
      ...feedbackCount,
      [source.droppableId]: feedbackCount[source.droppableId] - 1,
      [destination.droppableId]: feedbackCount[destination.droppableId] + 1,
    };

    setFeedbackStatusMap(items);
    setFeedbackCount(newFeedbackCount);
  };

  return (
    <main className="min-w-0 w-full overflow-hidden">
      <div className="flex overflow-x-auto border-t border-gray-200 gap-x-8 px-6 pt-4 no-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          {feedbackStatus.map((key) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div
                  key={key}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full border border-gray-200 rounded-lg"
                >
                  <RoadmapColumn
                    status={key}
                    projectsId={activeProjectId!}
                    setFeedbackStatusMap={setFeedbackStatusMap}
                    feedbackStatusMap={feedbackStatusMap}
                    feedbackCount={feedbackCount}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </main>
  );
}
