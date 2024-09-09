"use client";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FeedbackCardItem from "./FeedbackCardItem";
import { InboxIcon } from "@heroicons/react/24/outline";
import { Button } from "@/atoms/button";
import StatisticIcon from "@/assets/icons/StatisticIcon";
import CalenderIcon from "@/assets/icons/CalenderIcon";
import { useOnScreen } from "@/hooks/useOnScreen";
import Spin from "@/atoms/Spin";
import { classNames } from "@/lib/utils";
import { updateQueryParams } from "@/Utils";
import { FilterType } from "@/types";
import { IFeedbackBoard } from "@/interfaces";
import SearchInputBox from "@/components/SearchInputBox";

type FeedbackPublicContentContainerPropsType = {
  feedbackBoards: IFeedbackBoard[];
};

export default function FeedbackPublicContentContainer({
  feedbackBoards,
}: FeedbackPublicContentContainerPropsType) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {projectName} = useParams();
  const loadMoreRef = useRef(null);
  const isVisible = useOnScreen(loadMoreRef);
  const router = useRouter();
  const search = useMemo(() => {
    const data = searchParams.get("search");
    if (data && data !== "") {
      return searchParams.get("search");
    }
    return null;
  }, [searchParams]);
  const board = useMemo(() => {
    const data = searchParams.get("board");
    if (data && data !== "") {
      return searchParams.get("board");
    }
    return null;
  }, [searchParams]);
  const sort = useMemo(() => {
    const data = searchParams.get("sort");
    if (data && data !== "") {
      return searchParams.get("sort");
    }
    return null;
  }, [searchParams]);


  const {
    list: feedbackPostList,
    map: feedbackPostMap,
    loadMorePublicFeedbackPosts,
    isLoading: isFetchingFeedback,
    metaData: feedbackMetaData,
    getAllPublicFeedbackPosts,
  } = useFeedbackPostContext();

  const fetchAllFeedbackPosts = (
    board: string | null,
    search: string | null,
    sort: string | null
  ) => {
    const query: FilterType = { projectName: projectName! };

    if (board) query.board = board;
    if (search) query.search = search;
    if (sort && sort !== "top") query.sort = "desc";
    getAllPublicFeedbackPosts(query);
  };

  const sortedFeedbackPostList = useMemo(() => {
    if (sort === "top") {
      return feedbackPostList?.sort(
        (a, b) =>
          feedbackPostMap[b]?.upvotedCount! - feedbackPostMap[a]?.upvotedCount!
      );
    }
    return feedbackPostList;
  }, [feedbackPostList, feedbackPostMap, searchParams]);

  useEffect(() => {
    fetchAllFeedbackPosts(board, search, sort);
  }, [projectName, board, search, sort]);

  useEffect(() => {
    if (isVisible) {
      loadMorePublicFeedbackPosts();
    }
  }, [isVisible]);

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
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center gap-2 px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              className={`bg-white border border-gray-300 text-gray-700 flex gap-2 focus:bg-gray-200 ${
                sort === "top" ? "bg-gray-200" : ""
              }`}
              onClick={() =>
                router.push(
                  `${pathname}?${updateQueryParams(board, search, "top")}`
                )
              }
            >
              <StatisticIcon />
              <span className="text-xs">Top</span>
            </Button>
            <Button
              className={`bg-white border border-gray-300 text-gray-700 flex gap-2 ${
                sort === "new" ? "bg-gray-200" : ""
              }`}
              onClick={() =>
                router.push(
                  `${pathname}?${updateQueryParams(board, search, "new")}`
                )
              }
            >
              <CalenderIcon />
              <span className="text-xs">New</span>
            </Button>
          </div>
          {/* Search */}
          <SearchInputBox board={board!} />
        </div>
        <ul
          role="list"
          className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 sm:px-6 lg:px-8 overflow-y-auto"
          data-svelte-h="svelte-1g1nf9v"
        >
          {!isFetchingFeedback && !sortedFeedbackPostList?.length && (
            <li key="empty-list-item" className="relative py-10 px-6 bg-white">
              <div className="flex flex-col items-center justify-center text-center text-gray-400">
                <InboxIcon className="h-10 w-10" />

                <span>No Feedbacks Found</span>
              </div>
            </li>
          )}
          {sortedFeedbackPostList?.map((feedbackPost) => (
            <FeedbackCardItem feedback={feedbackPostMap[feedbackPost]!} />
          ))}
          <li
            ref={loadMoreRef}
            key={"loadMore"}
            className={classNames(
              "relative py-4 px-6 bg-white",
              !isFetchingFeedback && feedbackMetaData?.hasNextPage
                ? "visible:"
                : "hidden"
            )}
          >
            <Button
              ref={loadMoreRef}
              className="w-full inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={loadMorePublicFeedbackPosts}
            >
              {"Load More"}
            </Button>
          </li>
          {isFetchingFeedback && (
            <li key={"loading"} className="relative py-5 bg-white">
              <div className="flex items-center justify-center">
                <Spin className="h-5 w-5 mr-2" />

                <span>Loading...</span>
              </div>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
