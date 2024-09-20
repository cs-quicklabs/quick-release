"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiFilterQueryType, ChangeLogType, FilterCountMapType } from "@/types";
import { requestHandler, showNotification } from "@/Utils";
import {
  createChangeLogRequest,
  deleteOneChangeLogRequest,
  getAllChangeLogsRequest,
  getOneChangeLogRequest,
  publishOneChangeLogRequest,
  toggleArchiveOneChangeLogRequest,
  updateOneChangeLogRequest,
  getAllPublicChangeLogsRequest,
  getChangelogFilterCountRequest,
} from "@/fetchHandlers/changelog";
import { useProjectContext } from "./ProjectContext";
import { useUserContext } from "./UserContext";

type ChangeLogMapType = {
  [key: string]: ChangeLogType | null;
};

type ChangeLogContextType = {
  activeChangeLogId: string | null;
  error: string;
  isLoading: boolean;
  statusCountMap: FilterCountMapType;
  map: ChangeLogMapType;
  list: string[] | null;
  metaData: {
    [key: string]: any;
  };
  createChangeLog: (
    data: ChangeLogType,
    setIsLoading: (loading: boolean) => void
  ) => Promise<void>;
  getAllChangeLogs: (
    query: {} | undefined,
    page?: 1,
    limit?: number
  ) => Promise<void>;
  getChangeLog: (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => Promise<void>;
  updateChangeLog: (
    data: ChangeLogType,
    setIsLoading: (loading: boolean) => void
  ) => Promise<void>;
  loadMoreChangeLogs: () => Promise<void>;
  toggleArchiveOneChangeLog: (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => Promise<void>;
  publishNowOneChangeLog: (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => Promise<void>;
  deleteOneChangeLog: (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => Promise<void>;
  setActiveChangeLogId: (id: string) => void;
  getAllPublicChangeLogs: (
    query: {},
    page?: 1,
    limit?: number
  ) => Promise<void>;
  loadMorePublicChangeLogs: () => Promise<void>;
  getChangeLogFilterCount: (query: ApiFilterQueryType) => void;
};

// Create a context to manage change logs-related data and functions
const ChangeLogContext = createContext<ChangeLogContextType>({
  activeChangeLogId: null,
  error: "",
  isLoading: false,
  map: {} as ChangeLogMapType,
  statusCountMap: {} as FilterCountMapType,
  list: [] as string[],
  metaData: {} as { [key: string]: any },
  createChangeLog: async (
    data: ChangeLogType,
    setIsLoading: (loading: boolean) => void
  ) => {},
  getAllPublicChangeLogs: async (query = {}, page = 1, limit = 10) => {},
  loadMorePublicChangeLogs: async () => {},
  getAllChangeLogs: async (query = {}, page = 1, limit = 20) => {},
  getChangeLog: async (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => {},
  updateChangeLog: async (
    data: ChangeLogType,
    setIsLoading: (loading: boolean) => void
  ) => {},
  loadMoreChangeLogs: async () => {},
  publishNowOneChangeLog: async (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => {},
  toggleArchiveOneChangeLog: async (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => {},
  deleteOneChangeLog: async (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => {},
  setActiveChangeLogId: (id: string) => {},
  getChangeLogFilterCount: (query = {}) => {}
});

// Create a hook to access the ChangeLogContext
const useChangeLogContext = () => useContext(ChangeLogContext);

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
const ChangeLogProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [map, setMap] = useState<ChangeLogMapType>({});
  const [list, setList] = useState<string[]>([]);
  const [boards, setBoards] = useState<BoardMapType>({});
  const [activeBoardKey, setActiveBoardsKey] = useState<string>("");
  const [metaData, setMetaData] = useState<{ [key: string]: any }>({});
  const [activeChangeLogId, setActiveChangeLogId] = useState<string | null>(
    sessionStorage.getItem("activeChangeLogId") || null
  );
  const [statusCountMap, setStatusCountMap] = useState<FilterCountMapType>({});

  const { activeProjectId } = useProjectContext();
  const { loggedInUser } = useUserContext();

  const defaultBoardKey = useMemo(
    () => JSON.stringify({ projectId: activeProjectId }),
    [activeProjectId]
  );

  // Function to handle create change log
  const createChangeLog = async (
    data: ChangeLogType,
    setIsLoading: (loading: boolean) => void
  ) => {
    await requestHandler(
      async () =>
        await createChangeLogRequest({
          ...data,
          organizationsId: loggedInUser?.orgs[0]?.id,
        }),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const changelogId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [changelogId]: data,
        }));
        setList((prevList) => [changelogId, ...prevList]);
        setMetaData((prevMetaData) => ({
          ...prevMetaData,
          total: (prevMetaData?.total || 0) + 1,
        }));
        setStatusCountMap((prevStatusCountMap) => ({
          ...prevStatusCountMap,
          [data.status]: (prevStatusCountMap[data.status] || 0) + 1,
        }));
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  const getChangeLog = async (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => {
    setError("");
    await requestHandler(
      async () => await getOneChangeLogRequest(id),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const changelogId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [changelogId]: data,
        }));
        // showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  const updateChangeLog = async (
    data: ChangeLogType,
    setIsLoading: (loading: boolean) => void
  ) => {
    const changelogId = data.id!;
    const currentArchived = !!data.archivedAt;
    const previousArchived = !!map[changelogId]?.archivedAt;

    // Function to update the status count map
    const updateStatusCount = (prevStatusCountMap: any) => {
      const prevStatus = map[changelogId]?.status!;
      const newStatus = data.status;

      return {
        ...prevStatusCountMap,
        // Update archived count
        archived: prevStatusCountMap["archived"] + (currentArchived ? 1 : -1),
        // Adjust the previous and new status counts
        [prevStatus]: (prevStatusCountMap[prevStatus] || 1) - 1,
        [newStatus]: (prevStatusCountMap[newStatus] || 0) + 1,
      };
    };

    await requestHandler(
      async () =>
        await updateOneChangeLogRequest({
          ...data,
          organizationsId: loggedInUser?.orgs[0]?.id,
        }),
      setIsLoading,
      (res: any) => {
        const { message } = res;

        // Update the status count map
        setStatusCountMap((prevStatusCountMap) => {
          if (currentArchived !== previousArchived) {
            return updateStatusCount(prevStatusCountMap);
          }
          return prevStatusCountMap;
        });

        // Update the changelog map
        setMap((prevMap) => ({
          ...prevMap,
          [changelogId]: data,
        }));

        showNotification("success", message);
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
  const onSuccessGetAllChangeLogs = (res: any, query: {}, page: number) => {
    const { data } = res;
    const { changeLogs = [], ...metaDataDetails } = data as {
      changeLogs: ChangeLogType[];
      [key: string]: any;
    };
    const changeLogMap = changeLogs.reduce(
      (map: ChangeLogMapType, changelog: ChangeLogType) => {
        map[changelog?.id!] = changelog;
        return map;
      },
      {}
    );
    const changeLogIds = changeLogs
      .map((changeLog) => changeLog?.id)
      .filter((id) => id) as string[];

    if (page <= 1) {
      setMap(changeLogMap);
      setList(changeLogIds);
      setActiveChangeLogId(
        sessionStorage.getItem("activeChangeLogId")
          ? sessionStorage.getItem("activeChangeLogId")
          : changeLogIds[0] ?? null
      );
    } else {
      setMap((prevMap) => Object.assign({}, prevMap, changeLogMap));
      setList((prevList) => {
        const newList = new Set<string>([...prevList, ...changeLogIds]);
        return Array.from(newList);
      });
    }
    setMetaData({ ...metaDataDetails, prevQuery: query });
  };

  // Function to handle get all change log details
  const getAllChangeLogs = async (query = {}, page = 1, limit = 10) => {
    const nextBoardKey = JSON.stringify(query);
    if (nextBoardKey === activeBoardKey && isLoading) return;

    changeBoard(nextBoardKey);
    await requestHandler(
      async () => await getAllChangeLogsRequest({ ...query, page, limit }),
      setIsLoading,
      (res: { [key: string]: any }) =>
        onSuccessGetAllChangeLogs(res, query, page),
      (errMessage) => {
        showNotification("error", errMessage);
      }
    );
  };

  // Function to handle load more change log details
  const loadMoreChangeLogs = async () => {
    const { nextPage, hasNextPage = false, prevQuery } = metaData;
    if (isLoading && !hasNextPage) return;
    await getAllChangeLogs(prevQuery, nextPage);
  };

  // Function to handle get all change log details
  const getAllPublicChangeLogs = async (query = {}, page = 1, limit = 10) => {
    const nextBoardKey = JSON.stringify(query);
    if (nextBoardKey === activeBoardKey && isLoading) return;

    changeBoard(nextBoardKey);
    await requestHandler(
      async () =>
        await getAllPublicChangeLogsRequest({ ...query, page, limit }),
      setIsLoading,
      (res: { [key: string]: any }) =>
        onSuccessGetAllChangeLogs(res, query, page),
      (errMessage) => {
        // showNotification("error", errMessage);
        console.log("error", errMessage);
      }
    );
  };

  // Function to handle load more change log details
  const loadMorePublicChangeLogs = async () => {
    const { nextPage, hasNextPage = false, prevQuery } = metaData;
    if (isLoading && !hasNextPage) return;
    await getAllPublicChangeLogs(prevQuery, nextPage);
  };

  // Function to handle publish now change log
  const publishNowOneChangeLog = async (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => {
    await requestHandler(
      async () => await publishOneChangeLogRequest(id),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const changelogId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [changelogId]: data,
        }));
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  // Function to handle toggle archive change log
  const toggleArchiveOneChangeLog = async (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => {
    await requestHandler(
      async () => await toggleArchiveOneChangeLogRequest(id),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const changeLogId = data.id;

        setMap((prevMap) => ({
          ...prevMap,
          [changeLogId]: data,
        }));
        if(data.archivedAt) {
          setStatusCountMap((prevStatusCountMap) => ({
            ...prevStatusCountMap,
            [data.status]: (prevStatusCountMap[data.status] || 0) - 1,
            ["archived"]: (prevStatusCountMap["archived"] || 0) + 1,
          }))
        } else {
          setStatusCountMap((prevStatusCountMap) => ({
            ...prevStatusCountMap,
            [data.status]: (prevStatusCountMap[data.status] || 0) + 1,
            ["archived"]: (prevStatusCountMap["archived"] || 0) - 1,
          }))
        }
        showNotification("success", message);
        if (metaData?.prevQuery?.isArchived || metaData?.prevQuery?.status)
          getAllChangeLogs(metaData?.prevQuery!);
      },
      (errMessage) => {
        showNotification("error", errMessage);
      }
    );
  };

  // Function to handle delete change log
  const deleteOneChangeLog = async (
    id: string,
    setIsLoading: (loading: boolean) => void
  ) => {
    await requestHandler(
      async () => await deleteOneChangeLogRequest(id!),
      setIsLoading,
      (res: any) => {
        const { message, data } = res;
        const changeLogId = id;
        setMap((prevMap) => ({
          ...prevMap,
          [changeLogId]: null,
        }));
        setList((prevList) => prevList.filter((id) => id !== changeLogId));
        setMetaData((prevMetaData) => ({
          ...prevMetaData,
          prevQuery: {
            ...prevMetaData.prevQuery,
            deletedAt: new Date().toISOString(),
          },
          total: (prevMetaData?.total || 1) - 1,
        }));
        if (data.archivedAt) {
          setStatusCountMap((prevStatusCountMap) => ({
            ...prevStatusCountMap,
            ["archived"]: (prevStatusCountMap["archived"] || 0) - 1,
          }));
        } else {
          setStatusCountMap((prevStatusCountMap) => ({
            ...prevStatusCountMap,
            [data.status]: (prevStatusCountMap[data.status] || 0) - 1,
          }));
        }
        setActiveChangeLogId(null);
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
      }
    );
  };

  const getChangeLogFilterCount = async (query: ApiFilterQueryType) => {
    await requestHandler(
      async () => await getChangelogFilterCountRequest(query),
      setIsLoading,
      (res) => {
        const { data } = res;
        setStatusCountMap(data);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  // useEffect(() => {
  //   if (activeProjectId) {
  //     const query = { projectId: activeProjectId };
  //     getAllChangeLogs(query);
  //   }
  // }, [activeProjectId]);

  useEffect(() => {
    if (!activeChangeLogId && list.length > 0) {
      setActiveChangeLogId(list[0]);
    }
  }, [activeChangeLogId]);

  // Provide change logs-related data and functions through the context
  return (
    <ChangeLogContext.Provider
      value={{
        activeChangeLogId,
        error,
        isLoading,
        map,
        statusCountMap,
        list,
        metaData: Object.assign({}, metaData, {
          hasProjectChangeLogs:
            defaultBoardKey === activeBoardKey
              ? list?.length
              : !!boards[defaultBoardKey]?.list?.length,
        }),
        createChangeLog,
        getAllPublicChangeLogs,
        loadMorePublicChangeLogs,
        getAllChangeLogs,
        getChangeLog,
        updateChangeLog,
        loadMoreChangeLogs,
        publishNowOneChangeLog,
        toggleArchiveOneChangeLog,
        deleteOneChangeLog,
        setActiveChangeLogId,
        getChangeLogFilterCount,
      }}
    >
      {children}
    </ChangeLogContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { ChangeLogContext, ChangeLogProvider, useChangeLogContext };
