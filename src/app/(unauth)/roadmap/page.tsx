"use client";

import React, { useEffect, useState } from "react";
import { useProjectContext } from "@/app/context/ProjectContext";
import RoadmapColumn from "./components/RoadmapColumn";
import { FeedbackStatus } from "@/Utils/constants";
import Loading from "@/atoms/Loading";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { FeedbackPostType } from "@/types";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";

export default function AllPosts() {
  const [activeProjectLoading, setActiveProjectLoading] = useState(false);
  const { updateFeedbackStatus } = useFeedbackPostContext();
  const { activeProjectId, getActiveProject } = useProjectContext();
  const [feedbackStatusMap, setFeedbackStatusMap] = useState<{
    [key: string]: FeedbackPostType[];
  }>({});
  const [updateFeedbackLoading, setUpdateFeedbackLoading] = useState(false);

  useEffect(() => {
    if (!activeProjectId) {
      getActiveProject(setActiveProjectLoading);
    }
  }, [activeProjectId]);

  if (
    activeProjectLoading &&
    !activeProjectId &&
    Object.keys(feedbackStatusMap).length === 0
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
    const items = feedbackStatusMap;
    const [reorderedItem] = items[source.droppableId].splice(source.index, 1);
    items[destination.droppableId].splice(destination.index, 0, reorderedItem);

    const feedback = {
      id: draggableId,
      status: destination.droppableId,
      projectsId: activeProjectId!,
    };
    updateFeedbackStatus(feedback, setUpdateFeedbackLoading);
    setFeedbackStatusMap(items);
  };

  const feedbackStatus = ["IN_REVIEW", "PLANNED", "IN_PROGRESS"];

  return (
    <main className="min-w-0 w-full overflow-hidden">
      <div className="flex overflow-x-auto border-t border-gray-200 gap-x-8 px-6 pt-4 no-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          {feedbackStatus.map((key) => (
            <Droppable key={key} droppableId={key}>
              {(provided, snapshot) => (
                <div
                  key={key}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="xl:w-2/3 border border-gray-200 rounded-lg"
                >
                  <RoadmapColumn
                    status={key}
                    projectsId={activeProjectId!}
                    setFeedbackStatusMap={setFeedbackStatusMap}
                    feedbackStatusMap={feedbackStatusMap}
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
