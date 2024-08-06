"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { requestHandler, showNotification } from "@/Utils";
import { useUserContext } from "./UserContext";
import { IFeedbackBoard } from "@/interfaces";
import {
  createFeedbackBoardRequest,
  deleteFeedbackBoardRequest,
  getAllFeedbackBoardsRequest,
  updateFeedbackBoardRequest,
} from "../../fetchHandlers/feedbacks";
import { useProjectContext } from "./ProjectContext";

type FeedbackBoardMapType = {
  [key: string]: IFeedbackBoard | null;
};

// Create a context to manage change logs-related data and functions
const FeedbackBoardContext = createContext({
  error: "",
  map: {} as FeedbackBoardMapType,
  list: [] as number[],
  metaData: {} as { [key: string]: any },
  createFeedbackBoard: async (
    data: IFeedbackBoard,
    setIsLoading: (loading: boolean) => void,
    isNotify = true
  ) => {},
  getAllFeedbackBoards: async (setIsLoading: (loading: boolean) => void) => {},
  updateFeedbackBoard: async (
    data: IFeedbackBoard,
    setIsLoading: (loading: boolean) => void
  ) => {},
  deleteFeedbackBoard: async (
    id: number,
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
  const [list, setList] = useState<number[]>([]);
  const [metaData, setMetaData] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState("");
  const { activeProjectId } = useProjectContext();
  const { loggedInUser } = useUserContext();

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
        setList((prevList) => [feedbackBoardId, ...prevList]);
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
    setIsLoading: (loading: boolean) => void
  ) => {
    console.log("get all release tags", activeProjectId);
    await requestHandler(
      async () =>
        await getAllFeedbackBoardsRequest({ projectsId: loggedInUser?.activeProjectId! }),
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
        const feedbackBoardIds = feedbackBoards
          .map((feedbackBoard) => feedbackBoard?.id!)
          .filter((id) => id);

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
    id: number,
    setIsLoading: (loading: boolean) => void
  ) => {
    setError("");
    await requestHandler(
      async () =>
        await deleteFeedbackBoardRequest({ id, projectsId: loggedInUser?.activeProjectId! }),
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

  useEffect(() => {
    if (loggedInUser) {
      getAllFeedbackBoards(() => {});
    }
  }, [loggedInUser]);

  // Provide release tags-related data and functions through the context
  return (
    <FeedbackBoardContext.Provider
      value={{
        error,
        map,
        list,
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
