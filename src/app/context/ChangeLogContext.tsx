"use client";

import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { ChangeLogType } from "@/types";
import { requestHandler, showNotification } from "@/Utils";
import { createChangeLogRequest, getAllChangeLogsRequest } from "@/api";
import { useProjectContext } from "./ProjectContext";

type ChangeLogMapType = {
  [key: string]: ChangeLogType | null;
};

type ChangeLogContextType = {
  activeChangeLogId: string | null;
  error: string;
  isLoading: boolean;
  map: ChangeLogMapType;
  list: string[] | null;
  metaData: {
    [key: string]: any;
  };
  createChangeLog: (data: ChangeLogType, setIsLoading: (loading: boolean) => void) => Promise<void>;
  getAllChangeLogs: (query: {} | undefined, page?: 1, limit?: number) => Promise<void>;
  loadMoreChangeLogs: () => Promise<void>;
  setActiveChangeLogId: (id: string) => void;
};

// Create a context to manage change logs-related data and functions
const ChangeLogContext = createContext<ChangeLogContextType>({
  activeChangeLogId: null,
  error: "",
  isLoading: false,
  map: {} as ChangeLogMapType,
  list: [] as string[],
  metaData: {} as { [key: string]: any; },
  createChangeLog: async (data: ChangeLogType, setIsLoading: (loading: boolean) => void) => { },
  getAllChangeLogs: async (query = {}, page = 1, limit = 20) => { },
  loadMoreChangeLogs: async () => { },
  setActiveChangeLogId: (id: string) => { }
});

// Create a hook to access the ChangeLogContext
const useChangeLogContext = () => useContext(ChangeLogContext);

type ProviderProps = {
  children: ReactNode;
};

type BoardMapType = {
  [key: string]: {
    list?: string[],
    metaData?: { [key: string]: any; };
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
  const [metaData, setMetaData] = useState<{ [key: string]: any; }>({});
  const [activeChangeLogId, setActiveChangeLogId] = useState<string | null>(null);

  const { activeProjectId } = useProjectContext();

  const defaultBoardKey = useMemo(() => JSON.stringify({ projectId: activeProjectId }), [activeProjectId]);

  // Function to handle create change log
  const createChangeLog = async (data: ChangeLogType, setIsLoading: (loading: boolean) => void) => {
    await requestHandler(
      async () => await createChangeLogRequest(data),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const changelogId = data.id!;

        setMap(prevMap => ({
          ...prevMap,
          [changelogId]: data,
        }));
        setList(prevList => [changelogId, ...prevList]);
        setMetaData(prevMetaData => ({
          ...prevMetaData,
          total: (prevMetaData?.total || 0) + 1
        }));
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  // Function to handle get all change log details
  const getAllChangeLogs = async (query = {}, page = 1, limit = 10) => {
    const nextBoardKey = JSON.stringify(query);
    if (nextBoardKey === activeBoardKey && isLoading) return;

    setBoards((prevBoards: BoardMapType) => {
      const board = prevBoards[activeBoardKey] ?? {};

      return Object.assign({}, prevBoards, {
        [activeBoardKey]: Object.assign({}, board, { list, metaData })
      });
    });

    const nextBoard = boards[nextBoardKey] ?? {};
    setList(nextBoard.list ?? []);
    setMetaData(nextBoard.metaData ?? {});
    setActiveBoardsKey(nextBoardKey);

    await requestHandler(
      async () => await getAllChangeLogsRequest({ ...query, page, limit }),
      setIsLoading,
      (res: { [key: string]: any; }) => {
        const { data } = res;
        const { changeLogs = [], ...metaDataDetails } = data as { changeLogs: ChangeLogType[], [key: string]: any; };
        const changeLogMap = changeLogs.reduce((map: ChangeLogMapType, changelog: ChangeLogType) => {
          map[changelog?.id!] = changelog;
          return map;
        }, {});
        const changeLogIds = changeLogs.map((changeLog) => changeLog?.id).filter(id => id) as string[];

        if (page <= 1) {
          setMap(changeLogMap);
          setList(changeLogIds);
          setActiveChangeLogId(changeLogIds[0] ?? null);
        } else {
          setMap((prevMap) => Object.assign({}, prevMap, changeLogMap));
          setList((prevList) => {
            const newList = new Set<string>([...prevList, ...changeLogIds]);
            return Array.from(newList);
          });
        }
        setMetaData({ ...metaDataDetails, prevQuery: query });
      },
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

  useEffect(() => {
    if (activeProjectId) {
      const query = { projectId: activeProjectId };
      getAllChangeLogs(query);
    }
  }, [activeProjectId]);

  console.log("board", activeBoardKey, list, map, boards[defaultBoardKey]?.list?.length, boards);


  // Provide change logs-related data and functions through the context
  return (
    <ChangeLogContext.Provider value={{
      activeChangeLogId,
      error,
      isLoading,
      map,
      list,
      metaData: Object.assign({}, metaData, {
        hasProjectChangeLogs: defaultBoardKey === activeBoardKey ? list?.length : !!boards[defaultBoardKey]?.list?.length
      }),
      createChangeLog,
      getAllChangeLogs,
      loadMoreChangeLogs,
      setActiveChangeLogId
    }}>
      {children}
    </ChangeLogContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { ChangeLogContext, ChangeLogProvider, useChangeLogContext };
