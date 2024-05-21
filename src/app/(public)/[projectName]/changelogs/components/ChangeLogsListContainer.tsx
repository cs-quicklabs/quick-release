"use client";

import React, { useEffect, useRef } from "react";
import { useOnScreen } from "@/Utils/customHooks";
import { useChangeLogContext } from "@/app/context/ChangeLogContext";
import { classNames } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Spin from "@/components/Spin";
import ChangeLogListItem from "./ChangeLogListItem";
import { InboxIcon } from "@heroicons/react/20/solid";

const ChangeLogsListContainer = () => {
  const loadMoreRef = useRef(null);
  const isVisible = useOnScreen(loadMoreRef);

  const {
    isLoading: isFetchingChangeLogs,
    metaData: changeLogMetaData,
    list: changeLogsList,
    loadMorePublicChangeLogs
  } = useChangeLogContext();

  useEffect(() => {
    if (isVisible) {
      loadMorePublicChangeLogs();
    }
  }, [isVisible]);

  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0 p-4 min-h-0 h-full overflow-y-auto no-scrollbar">
      {
        !isFetchingChangeLogs && changeLogMetaData.total === 0 &&
        <main className="mx-auto max-w-2xl px-4 pt-10 pb-12 lg:pb-16">
          <div className="text-center">
            <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />

            <h3 className="mt-2 text-sm font-semibold text-gray-900">No records found</h3>
          </div>
        </main>
      }

      {
        changeLogsList?.map((id) => (
          <ChangeLogListItem
            key={id}
            id={id}
          />
        ))
      }

      <div
        ref={loadMoreRef}
        key={"loadMore"}
        className={classNames(
          "w-full",
          !isFetchingChangeLogs && changeLogMetaData?.hasNextPage ? "visible:" : "hidden"
        )}
      >
        <Button
          className="w-full inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={loadMorePublicChangeLogs}
        >
          Load More
        </Button>
      </div>

      {isFetchingChangeLogs && (
        <div
          key={"loading"}
          className="w-full flex items-center justify-center py-2"
        >
          <div className="flex items-center justify-center text-xl">
            <Spin className="h-6 w-6 mr-2" />

            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeLogsListContainer;
