"use client";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import FeedbackCardItem from "./FeedbackCardItem";
import { InboxIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/atoms/button";
import StatisticIcon from "@/assets/icons/StatisticIcon";
import CalenderIcon from "@/assets/icons/CalenderIcon";
import { useOnScreen } from "@/hooks/useOnScreen";
import Spin from "@/atoms/Spin";
import { classNames } from "@/lib/utils";

type FeedbackPublicContentContainerPropsType = {
  projectName: string;
  feedbackBoards: any[];
};

export default function FeedbackPublicSideNav({
  projectName,
  feedbackBoards,
}: FeedbackPublicContentContainerPropsType) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
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
  const [searchQuery, setSearchQuery] = useState(search || "");

  const {
    list: feedbackPostList,
    map: feedbackPostMap,
    loadMorePublicFeedbackPosts,
    isLoading: isFetchingFeedback,
    metaData: feedbackMetaData,
  } = useFeedbackPostContext();

  const updateQueryParams = (board: string | null, search: string | null) => {
    let queryParams = "";
    if (board) {
      queryParams += `board=${board}`;
    }

    if (search) {
      if (queryParams) queryParams += "&";
      queryParams += `search=${search}`;
    }

    router.push(`${pathname}?${queryParams}`);
  };

  const onSearch = (event: any) => {
    // Set the search query when Enter key is pressed
    if (event.key === "Enter") {
      updateQueryParams(board, event.target?.value);
    }
  };

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
        <div className="bg-white pt-5 pb-6 shadow border-b border-gray-200">
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
        <div className="flex justify-between items-center gap-2 px-8 py-4">
          <div className="flex items-center gap-4">
            <Button className="bg-white border border-gray-300 text-gray-700">
              <StatisticIcon />
              <span className="ml-2">Top</span>
            </Button>
            <Button className="bg-white border border-gray-300 text-gray-700">
              <CalenderIcon />
              <span className="ml-2">New</span>
            </Button>
          </div>
          <div>
            <div className="w-full">
              <div className="relative">
                <div className="hidden  pointer-events-none absolute inset-y-0 left-0 lg:flex items-center pl-3">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="search"
                  name="search"
                  onKeyDown={onSearch}
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded-md py-2 pl-10 pr-3 leading-5 text-gray-600 placeholder-gray-400 sm:text-sm w-[25rem]"
                  placeholder="Search feedbacks"
                  type="search"
                />
              </div>
            </div>
          </div>
        </div>

        <ul
          role="list"
          className="space-y-2 bg-gray-50 h-screen py-4 sm:space-y-4 sm:px-6 lg:px-8 overflow-y-auto"
          data-svelte-h="svelte-1g1nf9v"
        >
          {feedbackPostList && feedbackPostList.length > 0 ? (
            feedbackPostList.map((feedbackPost) => (
              <FeedbackCardItem feedback={feedbackPostMap[feedbackPost]!} />
            ))
          ) : (
            <div className="text-center">
              <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />

              <h3 className="mt-2 text-sm font-semibold mt-2 text-gray-900">
                {"No feedback found"}
              </h3>
            </div>
          )}
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
