"use client";

import React, { useEffect, useState } from "react";
import { useProjectContext } from "@/app/context/ProjectContext";
import RoadmapColumn from "./components/RoadmapColumn";
import { FeedbackStatus } from "@/Utils/constants";
import Loading from "@/atoms/Loading";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

export default function AllPosts() {
  const [activeProjectLoading, setActiveProjectLoading] = useState(false);
  const { activeProjectId, getActiveProject } = useProjectContext();
  const [feedbackStatusMap, setFeedbackStatusMap] = useState<any>({});

  useEffect(() => {
    if (!activeProjectId) {
      getActiveProject(setActiveProjectLoading);
    }
  }, [activeProjectId]);

  if (activeProjectLoading && !activeProjectId) {
    return (
      <main className="overflow-hidden border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 lg:px-0 pt-10 pb-12 lg:pb-16">
          <Loading />
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 w-full overflow-hidden">
      <div className="flex overflow-x-auto border-t border-gray-200 gap-x-8 px-6 pt-4 no-scrollbar">
        {Object.keys(FeedbackStatus).map((key) => (
          <div key={key} className="xl:w-2/3 border border-gray-200 rounded-lg">
            <RoadmapColumn
              status={key}
              projectsId={activeProjectId!}
              setFeedbackStatusMap={setFeedbackStatusMap}
              feedbackStatusMap={feedbackStatusMap}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
