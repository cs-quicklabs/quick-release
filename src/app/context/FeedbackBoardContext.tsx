"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { requestHandler, showNotification } from "@/Utils";
import { IFeedbackBoard } from "@/interfaces";
import {
  createFeedbackBoardRequest,
  deleteFeedbackBoardRequest,
  getAllFeedbackBoardsRequest,
  updateFeedbackBoardRequest,
} from "../../fetchHandlers/feedbacks";

type FeedbackBoardMapType = {
  [key: string]: IFeedbackBoard | null;
};

// Create a context to manage change logs-related data and functions
const FeedbackBoardContext = createContext({
  error: "",
  map: {} as FeedbackBoardMapType,
  list: [] as string[],
  setList: (list: string[]) => {},
  setMap: (map: FeedbackBoardMapType) => {},
  metaData: {} as { [key: string]: any },
  createFeedbackBoard: async (
    data: IFeedbackBoard,
    setIsLoading: (loading: boolean) => void,
    isNotify = true
  ) => {},
  getAllFeedbackBoards: async (
    query: { [key: string]: any },
    setIsLoading: (loading: boolean) => void
  ) => {},
  updateFeedbackBoard: async (
    data: IFeedbackBoard,
    setIsLoading: (loading: boolean) => void
  ) => {},
  deleteFeedbackBoard: async (
    id: string,
    projectsId: string,
    setIsLoading: (loading: boolean) => void
  ) => {},
});

// Create a hook to access the FeedbackBoardContext
const useFeedbackBoardContext = () => useContext(FeedbackBoardContext);

type ProviderProps = {
  children: ReactNode;
};

// Create a component that provides change log related data and functions
const FeedbackBoardProvider: React.FC<ProviderProps> = ({ children }) => {
  const [map, setMap] = useState<FeedbackBoardMapType>({});
  const [list, setList] = useState<string[]>([]);
  const [metaData, setMetaData] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState("");
  // Function to handle create release tag
  const createFeedbackBoard = async (
    data: IFeedbackBoard,
    setIsLoading: (loading: boolean) => void,
    isNotify = true
  ) => {
    setError("");
    await requestHandler(
      async () => await createFeedbackBoardRequest(data),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const feedbackBoardId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [feedbackBoardId]: data,
        }));
        setList((prevList) => [...prevList, feedbackBoardId]);
        isNotify && showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };
  // Function to handle get all release tags
  const getAllFeedbackBoards = async (
    query: { [key: string]: any },
    setIsLoading: (loading: boolean) => void
  ) => {
    await requestHandler(
      async () => await getAllFeedbackBoardsRequest(query),
      setIsLoading,
      (res: any) => {
        const { data } = res;
        const { feedbackBoards = [], ...metaData } = data as {
          feedbackBoards: IFeedbackBoard[];
          [key: string]: any;
        };

        const feedbackBoardMap = feedbackBoards.reduce(
          (map: FeedbackBoardMapType, feedbackBoard: IFeedbackBoard) => {
            map[feedbackBoard?.id!] = feedbackBoard;
            return map;
          },
          {}
        );
        const feedbackBoardIds = Object.keys(feedbackBoardMap);
        setMap(feedbackBoardMap);
        setList(feedbackBoardIds);
        setMetaData(metaData);
      },
      (errorMsg) => {
        console.log("get all release tags error: ", errorMsg);
        showNotification("error", errorMsg);
      }
    );
  };

  // Function to handle update release tag
  const updateFeedbackBoard = async (
    data: IFeedbackBoard,
    setIsLoading: (loading: boolean) => void
  ) => {
    setError("");
    await requestHandler(
      async () => await updateFeedbackBoardRequest(data),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const feedbackBoardId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [feedbackBoardId]: data,
        }));
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  // Function to handle delete release tag
  const deleteFeedbackBoard = async (
    id: string,
    projectsId: string,
    setIsLoading: (loading: boolean) => void
  ) => {
    setError("");
    await requestHandler(
      async () =>
        await deleteFeedbackBoardRequest({
          id,
          projectsId,
        }),
      setIsLoading,
      (res: any) => {
        const { message } = res;
        const feedbackBoardId = id;

        setMap((prevMap) => ({
          ...prevMap,
          [feedbackBoardId]: null,
        }));
        setList((prevList) => prevList.filter((id) => id !== feedbackBoardId));
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  // Provide release tags-related data and functions through the context
  return (
    <FeedbackBoardContext.Provider
      value={{
        error,
        map,
        list,
        setList,
        setMap,
        metaData,
        createFeedbackBoard,
        getAllFeedbackBoards,
        updateFeedbackBoard,
        deleteFeedbackBoard,
      }}
    >
      {children}
    </FeedbackBoardContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { FeedbackBoardContext, FeedbackBoardProvider, useFeedbackBoardContext };
