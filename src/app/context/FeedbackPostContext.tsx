"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiFilterQueryType, FeedbackPostType } from "@/types";
import { requestHandler, showNotification } from "@/Utils";
import {
  createFeedbackPostRequest,
  deleteFeedbackPostRequest,
  getAllFeedbackPostsRequest,
  getOneFeedbackPostRequest,
  updateFeedbackPostRequest,
  upvoteFeedbackRequest,
} from "@/fetchHandlers/feedbacks";
import { useProjectContext } from "./ProjectContext";
import { useUserContext } from "./UserContext";

type FeedbackPostMapType = {
  [key: string]: FeedbackPostType | null;
};

type FeedbackPostContextType = {
  activeFeedbackPostId: string | null;
  error: string;
  isLoading: boolean;
  map: FeedbackPostMapType;
  list: string[] | null;
  metaData: {
    [key: string]: any;
  };
  createFeedbackPost: (
    data: FeedbackPostType,
    setIsLoading: (loading: boolean) => void
  ) => Promise<void>;
  getAllFeedbackPosts: (
    query: {} | undefined,
    page?: 1,
    limit?: number
  ) => Promise<void>;
  getFeedbackPost: (id: string, query: {} | undefined) => Promise<void>;
  loadMoreFeedbackPosts: () => Promise<void>;
  setActiveFeedbackPostId: (id: string) => void;
  updateFeedbackPost: (
    data: FeedbackPostType,
    setIsLoading: (loading: boolean) => void
  ) => Promise<void>;
  deleteFeedbackPost: (id: string, projectsId: string) => Promise<void>;
  upvoteFeedbackPost: (id: string, projectsId: string) => Promise<void>;
};

// Create a context to manage change logs-related data and functions
const FeedbackPostContext = createContext<FeedbackPostContextType>({
  activeFeedbackPostId: null,
  error: "",
  isLoading: false,
  map: {} as FeedbackPostMapType,
  list: [] as string[],
  metaData: {} as { [key: string]: any },
  createFeedbackPost: async (
    data: FeedbackPostType,
    setIsLoading: (loading: boolean) => void
  ) => {},
  getAllFeedbackPosts: async (query = {}, page = 1, limit = 20) => {},
  getFeedbackPost: async (id: string, query: {} | undefined) => {},
  loadMoreFeedbackPosts: async () => {},
  setActiveFeedbackPostId: (id: string) => {},
  updateFeedbackPost: async (
    data: FeedbackPostType,
    setIsLoading: (loading: boolean) => void
  ) => {},
  deleteFeedbackPost: async (id: string, projectsId: string) => {},
  upvoteFeedbackPost: async (id: string, projectsId: string) => {},
});

// Create a hook to access the FeedbackPostContext
const useFeedbackPostContext = () => useContext(FeedbackPostContext);

type ProviderProps = {
  children: ReactNode;
};

type BoardMapType = {
  [key: string]: {
    list?: string[];
    metaData?: { [key: string]: any };
  };
};

// Create a component that provides change log related data and functions
const FeedbackPostProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [map, setMap] = useState<FeedbackPostMapType>({});
  const [list, setList] = useState<string[] | null>(null);
  const [boards, setBoards] = useState<BoardMapType>({});
  const [activeBoardKey, setActiveBoardsKey] = useState<string>("");
  const [metaData, setMetaData] = useState<{ [key: string]: any }>({});
  const [activeFeedbackPostId, setActiveFeedbackPostId] = useState<
    string | null
  >(sessionStorage.getItem("activeFeedbackPostId") || null);

  const { activeProjectId } = useProjectContext();
  const { loggedInUser } = useUserContext();

  const defaultBoardKey = useMemo(
    () => JSON.stringify({ projectId: activeProjectId }),
    [activeProjectId]
  );

  // Function to handle create change log
  const createFeedbackPost = async (
    data: FeedbackPostType,
    setIsLoading: (loading: boolean) => void
  ) => {
    console.log(data);
    await requestHandler(
      async () => await createFeedbackPostRequest(data),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const feedbackpostId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [feedbackpostId]: data,
        }));
        setList((prevList) =>
          prevList ? [feedbackpostId, ...prevList] : [feedbackpostId]
        );
        setMetaData((prevMetaData) => ({
          ...prevMetaData,
          total: (prevMetaData?.total || 0) + 1,
        }));

        sessionStorage.removeItem("activeFeedbackPostId");
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  const getFeedbackPost = async (
    id: string,
    query: { [key: string]: any } = {}
  ) => {
    setError("");
    await requestHandler(
      async () => await getOneFeedbackPostRequest(id, query),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const feedbackpostId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [feedbackpostId]: data,
        }));
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  /// Function to change next board
  const changeBoard = (nextBoardKey: string) => {
    if (nextBoardKey !== activeBoardKey) {
      setBoards((prevBoards: BoardMapType) => {
        const board = prevBoards[activeBoardKey] ?? {};

        return Object.assign({}, prevBoards, {
          [activeBoardKey]: Object.assign({}, board, { list, metaData }),
        });
      });

      const nextBoard = boards[nextBoardKey] ?? {};
      setList(nextBoard.list ?? []);
      setMetaData(nextBoard.metaData ?? {});
      setActiveBoardsKey(nextBoardKey);
    }
  };

  // Function to handle get all change logs success response
  const onSuccessGetAllFeedbackPosts = (res: any, query: {}, page: number) => {
    const { data } = res;
    const { feedbackPosts = [], ...metaDataDetails } = data as {
      feedbackPosts: FeedbackPostType[];
      [key: string]: any;
    };
    const feedbackPostMap = feedbackPosts.reduce(
      (map: FeedbackPostMapType, feedbackpost: FeedbackPostType) => {
        map[feedbackpost?.id!] = feedbackpost;
        return map;
      },
      {}
    );
    const feedbackPostIds = feedbackPosts
      .map((feedbackPost) => feedbackPost?.id)
      .filter((id) => id) as string[];

    if (page <= 1) {
      setMap(feedbackPostMap);
      setList(feedbackPostIds);
      setActiveFeedbackPostId(
        sessionStorage.getItem("activeFeedbackPostId")
          ? sessionStorage.getItem("activeFeedbackPostId")
          : feedbackPostIds[0] ?? null
      );
    } else {
      setMap((prevMap) => Object.assign({}, prevMap, feedbackPostMap));
      setList((prevList) => {
        const newList = new Set<string>(
          prevList ? [...prevList, ...feedbackPostIds] : feedbackPostIds
        );
        return Array.from(newList);
      });
    }
    setMetaData({ ...metaDataDetails, prevQuery: query });
  };

  // Function to handle get all change log details
  const getAllFeedbackPosts = async (query = {}, page = 1, limit = 10) => {
    const nextBoardKey = JSON.stringify(query);
    if (nextBoardKey === activeBoardKey && isLoading) return;

    changeBoard(nextBoardKey);
    await requestHandler(
      async () => await getAllFeedbackPostsRequest({ ...query, page, limit }),
      setIsLoading,
      (res: { [key: string]: any }) =>
        onSuccessGetAllFeedbackPosts(res, query, page),
      (errMessage) => {
        showNotification("error", errMessage);
      }
    );
  };

  const updateFeedbackPost = async (
    data: FeedbackPostType,
    setIsLoading: (loading: boolean) => void
  ) => {
    await requestHandler(
      async () => await updateFeedbackPostRequest(data),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const feedbackId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [feedbackId]: data,
        }));
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  const deleteFeedbackPost = async (id: string, projectsId: string) => {
    await requestHandler(
      async () => await deleteFeedbackPostRequest(id, projectsId),
      setIsLoading,
      (res: any) => {
        const { message } = res;
        const feedbackId = id;

        setMap((prevMap) => ({
          ...prevMap,
          [feedbackId]: null,
        }));
        setList((prevList) => prevList!.filter((id) => id !== feedbackId));
        setMetaData((prevMetaData) => ({
          ...prevMetaData,
          prevQuery: {
            ...prevMetaData.prevQuery,
            deletedAt: new Date().toISOString(),
          },
          total: (prevMetaData?.total || 1) - 1,
        }));
        sessionStorage.removeItem("activeFeedbackPostId");
        setActiveFeedbackPostId(null);
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
      }
    );
  };

  const upvoteFeedbackPost = async (id: string, projectsId: string) => {
    await requestHandler(
      async () => await upvoteFeedbackRequest(id, projectsId),
      setIsLoading,
      (res: any) => {
        const { data } = res;
        const feedbackId = id;
        setMap((prevMap) => ({
          ...prevMap,
          [feedbackId]: data,
        }));
      },
      (errMessage) => {
        showNotification("error", errMessage);
      }
    );
  };

  // Function to handle load more change log details
  const loadMoreFeedbackPosts = async () => {
    const { nextPage, hasNextPage = false, prevQuery } = metaData;
    if (isLoading && !hasNextPage) return;
    await getAllFeedbackPosts(prevQuery, nextPage);
  };

  useEffect(() => {
    if (!activeFeedbackPostId && list && list.length > 0) {
      setActiveFeedbackPostId(list[0]);
    }
  }, [activeFeedbackPostId]);

  // Provide change logs-related data and functions through the context
  return (
    <FeedbackPostContext.Provider
      value={{
        activeFeedbackPostId,
        error,
        isLoading,
        map,
        list,
        metaData: Object.assign({}, metaData, {
          hasProjectFeedbackPosts:
            defaultBoardKey === activeBoardKey
              ? list?.length
              : !!boards[defaultBoardKey]?.list?.length,
        }),
        createFeedbackPost,
        getAllFeedbackPosts,
        getFeedbackPost,
        loadMoreFeedbackPosts,
        setActiveFeedbackPostId,
        updateFeedbackPost,
        deleteFeedbackPost,
        upvoteFeedbackPost,
      }}
    >
      {children}
    </FeedbackPostContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { FeedbackPostContext, FeedbackPostProvider, useFeedbackPostContext };
