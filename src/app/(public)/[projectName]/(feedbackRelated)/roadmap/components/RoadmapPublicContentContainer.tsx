"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import RoadmapColumn from "./RoadmapColumn";

type FeedbackPublicContentContainerPropsType = {
  feedbackBoards: any[];
};

export default function RoadmapPublicContentContainer({
  feedbackBoards,
}: FeedbackPublicContentContainerPropsType) {
  const searchParams = useSearchParams();
  const { projectName } = useParams();
  const board = useMemo(() => {
    const data = searchParams.get("board");
    if (data && data !== "") {
      return searchParams.get("board");
    }
    return null;
  }, [searchParams]);

  const feedbackStatus = ["IN_REVIEW", "PLANNED", "IN_PROGRESS"];

  return (
    <section
      className="flex h-full min-w-0 flex-1 flex-col overflow-hidden xl:order-last"
      aria-labelledby="message-heading"
    >
      <div className="flex-1 overflow-y-auto pb-10 no-scrollbar">
        <div className="bg-white py-4 shadow border-b border-gray-200">
          <div className="px-4 sm:flex sm:items-baseline sm:justify-between sm:px-6 lg:px-8">
            <div className="sm:w-0 sm:flex-1" data-svelte-h="svelte-4musx2">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-medium text-gray-900">
                  {board
                    ? board
                    : feedbackBoards.find((b) => b.isDefault)?.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex min-w-[50rem]  gap-x-8 px-6 pt-4">
          <div className="inline-flex gap-4 w-full no-scrollbar overflow-x-auto lg:overflow-hidden">
            {feedbackStatus.map((key) => (
              <div
                key={key}
                className="w-full border border-gray-200 rounded-lg"
              >
                <RoadmapColumn status={key} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
