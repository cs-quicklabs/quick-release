import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { useProjectContext } from "@/app/context/ProjectContext";
import { Menu, Transition } from "@headlessui/react";
import { FunnelIcon, InboxIcon } from "@heroicons/react/20/solid";
import Spin from "@/atoms/Spin";
import { useOnScreen } from "@/hooks/useOnScreen";
import { classNames } from "@/lib/utils";
import FeedbackCardItem from "./FeedbackCardItem";
import { Button } from "@/atoms/button";
import { FeedbackStatus } from "@/Utils/constants";
import Link from "next/link";
import { useFeedbackBoardContext } from "@/app/context/FeedbackBoardContext";
import { Checkbox } from "flowbite-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SideNavProps = {
  showSideNav: boolean;
  setShowSideNav: (show: boolean) => void;
  fetchAllFeedbackPosts: (boards: string | null, status: string | null, search: string | null) => void;
  search?: string | null;
};

const FeedbackSideNav: React.FC<SideNavProps> = ({
  showSideNav = false,
  setShowSideNav,
  fetchAllFeedbackPosts,
  search,
}) => {
  const loadMoreRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVisible = useOnScreen(loadMoreRef);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const { activeProjectId } = useProjectContext();
  const { map: feedbackBoardsMap } = useFeedbackBoardContext();
  const {
    isLoading: isFetchingFeedback,
    metaData: feedbackMetaData,
    list: feedbackList,
    loadMoreFeedbackPosts,
  } = useFeedbackPostContext();

  const onSelectBoards = (value: string) => {
    let boards = [...selectedBoards];
    if (boards.includes(value)) {
      boards = boards.filter((item) => item !== value);
    } else {
      boards.push(value);
    }
    console.log(boards, "boards");
    setSelectedBoards(boards);
    fetchAllFeedbackPosts(boards.toString(), selectedStatus.toString(), search!);
  };

  const onSelectStatus = (value: string) => {
    let status = [...selectedStatus];
    if (status.includes(value)) {
      status = status.filter((item) => item !== value);
    } else {
      status.push(value);
    }
    setSelectedStatus(status);
    fetchAllFeedbackPosts(selectedBoards.toString(), status.toString(), search!);
  };

  useEffect(() => {
    if (isVisible) {
      loadMoreFeedbackPosts();
    }
  }, [isVisible]);

  const onClearFilter = () => {
    setSelectedBoards([]);
    setSelectedStatus([]);
    fetchAllFeedbackPosts(null, null, search!);
  };

  return (
    <aside
      className={classNames(
        "xl:order-first xl:block xl:flex-shrink-0",
        "xl:relative xl:h-full  xl:overflow-y-hidden xl:transition-none xl:translate-x-0 xl:w-96",
        "sm:fixed sm:top-0 sm:left-0 sm:z-40 sm:h-screen sm:overflow-y-auto sm:transition-transform sm:w-screen sm:bg-black sm:bg-opacity-35",
        !showSideNav && "sm:-translate-x-full"
      )}
      onClick={() => setShowSideNav(false)}
    >
      <div className="relative flex h-full w-96 flex-col border-r border-gray-200 bg-gray-100">
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <div className="flex border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-500">
            <span
              className="w-full py-1 text-sm font-medium"
              data-svelte-h="svelte-19a70nh"
            >
              {"Feedback List"}
            </span>

            <div className="relative inline-block text-left">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    className={classNames(
                      "inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm font-medium text-gray-700 shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                      "bg-white hover:bg-gray-50 text-gray-400 border-gray-300"
                    )}
                    id="filter-feedback"
                  >
                    <FunnelIcon
                      className={classNames("h-3 w-3", "text-gray-400")}
                      aria-hidden={true}
                    />
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="px-4 py-2 border-b border-gray-100"
                      role="none"
                    >
                      <p className="text-sm" role="none">
                        Boards
                      </p>
                    </div>

                    {Object.values(feedbackBoardsMap).map((feedbackBoards) => (
                      <Menu.Item key={feedbackBoards?.id}>
                        {() => (
                          <div className="text-gray-700 flex justify-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Checkbox
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                              name={feedbackBoards?.id}
                              checked={selectedBoards.includes(
                                feedbackBoards?.id!
                              )}
                              onChange={() =>
                                onSelectBoards(feedbackBoards?.id!)
                              }
                              readOnly
                            />
                            <span>{feedbackBoards?.name}</span>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                    <div
                      className="px-4 py-2 border-b border-gray-100"
                      role="none"
                    >
                      <p className="text-sm" role="none">
                        Status
                      </p>
                    </div>

                    {Object.values(FeedbackStatus).map(
                      ({ id, title, bulletColor }) => (
                        <Menu.Item key={id}>
                          {() => (
                            <div className="text-gray-700 flex justify-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                              <Checkbox
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                name={id}
                                checked={selectedStatus.includes(id)}
                                onChange={() => onSelectStatus(id)}
                                readOnly
                              />
                              <span
                                className={`h-2 w-2 rounded-full ${bulletColor}`}
                                aria-hidden={true}
                              />

                              <span>{title}</span>
                            </div>
                          )}
                        </Menu.Item>
                      )
                    )}

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
            {!isFetchingFeedback && !feedbackList?.length && (
              <li
                key="empty-list-item"
                className="relative py-10 px-6 bg-white"
              >
                <div className="flex flex-col items-center justify-center text-center text-gray-400">
                  <InboxIcon className="h-10 w-10" />

                  <span>No Feedbacks Found</span>
                </div>
              </li>
            )}

            {feedbackList?.map((id) => (
              <FeedbackCardItem key={id} id={id} />
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
                onClick={loadMoreFeedbackPosts}
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
        </nav>
      </div>
    </aside>
  );
};

export default FeedbackSideNav;
