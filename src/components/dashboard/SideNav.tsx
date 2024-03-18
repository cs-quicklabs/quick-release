import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChangeLogContext } from "@/app/context/ChangeLogContext";
import { useProjectContext } from "@/app/context/ProjectContext";
import ChangeLogCardItem from "./ChangeLogCardItem";
import { Menu, Transition } from "@headlessui/react";
import { FunnelIcon, InboxIcon } from "@heroicons/react/20/solid";

import Link from "next/link";
import { ChangeLogsStatus } from "@/Utils/constants";
import Spin from "@/components/Spin";
import { Button } from "../ui/button";
import { useOnScreen } from "@/Utils/customHooks";
import { classNames } from "@/lib/utils";

type FilterType = {
  projectId?: string;
  [key: string]: any;
};

type SideNavProps = {
  showSideNav: boolean;
  setShowSideNav: (show: boolean) => void;
};

const SideNav: React.FC<SideNavProps> = ({ showSideNav = false, setShowSideNav }) => {
  const loadMoreRef = useRef(null);
  const isVisible = useOnScreen(loadMoreRef);

  const [filter, setFilter] = useState<FilterType>({});

  const { activeProjectId } = useProjectContext();
  const {
    isLoading: isFetchingChangeLogs,
    metaData: changeLogMetaData,
    list: changeLogsList,
    getAllChangeLogs,
    loadMoreChangeLogs
  } = useChangeLogContext();

  const fetchAllChangesLogs = useCallback(() => {
    const query: FilterType = { projectId: activeProjectId! };
    setFilter(query);
    getAllChangeLogs(query);
  }, [activeProjectId]);

  useEffect(() => {
    if (activeProjectId && !changeLogsList?.length) {
      fetchAllChangesLogs();
    }
  }, [activeProjectId]);

  useEffect(() => {
    if (isVisible) {
      loadMoreChangeLogs();
    }
  }, [isVisible]);

  const onSelectStatus = (status: string) => {
    const newFilter: FilterType = { projectId: activeProjectId! };
    if (status === "archived") {
      newFilter.isArchived = true;
      newFilter.status = undefined;
    } else {
      newFilter.isArchived = undefined;
      newFilter.status = status;
    }

    setFilter(newFilter);
    getAllChangeLogs(newFilter);
  };

  const onClearFilter = () => {
    if (filter.status || filter.isArchived) {
      fetchAllChangesLogs();
    }
  };

  const filterStatus = useMemo(() => {
    if (filter.isArchived) {
      return ChangeLogsStatus.archived;
    }

    if (filter.status) {
      return ChangeLogsStatus[filter.status];
    }

    return null;
  }, [filter.status, filter.isArchived]);

  return (
    <aside
      className={classNames(
        "xl:order-first xl:block xl:flex-shrink-0",
        "xl:relative xl:overflow-y-hidden xl:transition-none xl:translate-x-0 xl:w-96",
        "sm:fixed sm:top-0 sm:left-0 sm:z-40 sm:h-screen sm:overflow-y-auto sm:transition-transform sm:w-screen sm:bg-black sm:bg-opacity-35",
        !showSideNav && "sm:-translate-x-full"
      )}
      onClick={() => setShowSideNav(false)}
    >
      <div className="relative flex h-full w-96 flex-col border-r border-gray-200 bg-gray-100">
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-500">
            <span className="w-full py-1 text-sm font-medium" data-svelte-h="svelte-19a70nh">
              Change Logs
            </span>

            <div className="relative inline-block text-left">
              <Menu as="div" className="relative inline-block text-left" >
                <div>
                  <Menu.Button className={classNames(
                    "inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm font-medium text-gray-700 shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                    filterStatus ? `${filterStatus.textColor} ${filterStatus.bgColor} hover:${filterStatus.bgColor}` : "bg-white hover:bg-gray-50 text-gray-400 border-gray-300",
                  )}>
                    <FunnelIcon
                      className={classNames(
                        "h-3 w-3",
                        filterStatus ? `${filterStatus.textColor}` : "text-gray-400",
                      )}
                      aria-hidden={true}
                    />

                    {
                      filterStatus &&
                      <span className="ml-2">
                        {filterStatus.title}
                      </span>
                    }
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="px-4 py-2 border-b border-gray-100"
                      role="none"
                    >
                      <p className="text-sm" role="none">
                        Filter by Status
                      </p>
                    </div>

                    {
                      Object.values(ChangeLogsStatus).map(({ id, title, bulletColor }) => (
                        <Menu.Item key={id}>
                          {() => (
                            <Link
                              href="#"
                              className="text-gray-700 flex justify-left px-4 py-2 text-sm hover:bg-gray-50"
                              onClick={(e) => onSelectStatus(id)}
                            >
                              <span
                                className={`inline-block h-2 w-2 mt-1.5 mr-2 flex-shrink-0 rounded-full ${bulletColor}`}
                                aria-hidden={true}
                              />

                              <span>{title}</span>
                            </Link>
                          )}
                        </Menu.Item>
                      ))
                    }

                    <div
                      className="px-4 py-2 border-t border-gray-100 hover:bg-gray-50"
                      role="none"
                    >
                      <Menu.Button
                        className="text-gray-700 block w-full py-1 text-left text-sm"
                        onClick={onClearFilter}
                      >
                        Clear Filter
                      </Menu.Button>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-y-auto"
          aria-label="Message list"
          data-svelte-h="svelte-3mai4c"
        >
          <ul
            className="divide-y divide-gray-200 border-b border-gray-200"
            role="list"
          >
            {
              !isFetchingChangeLogs && !changeLogsList?.length && (
                <li
                  key="empty-list-item"
                  className="relative py-10 px-6 bg-white"
                >
                  <div className="flex flex-col items-center justify-center text-center text-gray-400">
                    <InboxIcon className="h-10 w-10" />

                    <span>No Change Logs Found</span>
                  </div>
                </li>
              )
            }

            {
              changeLogsList?.map((id) => (
                <ChangeLogCardItem
                  key={id}
                  id={id}
                />
              ))
            }

            <li
              ref={loadMoreRef}
              key={"loadMore"}
              className={classNames(
                "relative py-4 px-6 bg-white",
                !isFetchingChangeLogs && changeLogMetaData?.hasNextPage ? "visible:" : "hidden"
              )}

            >
              <Button
                ref={loadMoreRef}
                className="w-full inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={loadMoreChangeLogs}
              >
                Load More
              </Button>
            </li>

            {isFetchingChangeLogs && (
              <li
                key={"loading"}
                className="relative py-5 bg-white"
              >
                <div className="flex items-center justify-center">
                  <Spin className="h-5 w-5 mr-2" />

                  <span>Loading...</span>
                </div>
              </li>
            )}


          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SideNav;
