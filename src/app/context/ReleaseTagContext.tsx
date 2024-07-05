"use client";

import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { requestHandler, showNotification } from "@/Utils";
import { useUserContext } from "./UserContext";
import { IReleaseTag } from "@/interfaces";
import { createReleaseTagRequest, deleteReleaseTagRequest, getAllReleaseTagsRequest, updateReleaseTagRequest } from "../../fetchHandlers/releaseTags";

type ReleaseTagMapType = {
  [key: string]: IReleaseTag | null;
};

// Create a context to manage change logs-related data and functions
const ReleaseTagContext = createContext({
  error: "",
  map: {} as ReleaseTagMapType,
  list: [] as number[],
  metaData: {} as { [key: string]: any; },
  createReleaseTag: async (data: IReleaseTag, setIsLoading: (loading: boolean) => void, isNotify = true) => { },
  getAllReleaseTags: async (setIsLoading: (loading: boolean) => void) => { },
  updateReleaseTag: async (data: IReleaseTag, setIsLoading: (loading: boolean) => void) => { },
  deleteReleaseTag: async (id: number, setIsLoading: (loading: boolean) => void) => { },
});

// Create a hook to access the ReleaseTagContext
const useReleaseTagContext = () => useContext(ReleaseTagContext);

type ProviderProps = {
  children: ReactNode;
};

// Create a component that provides change log related data and functions
const ReleaseTagProvider: React.FC<ProviderProps> = ({ children }) => {
  const [map, setMap] = useState<ReleaseTagMapType>({});
  const [list, setList] = useState<number[]>([]);
  const [metaData, setMetaData] = useState<{ [key: string]: any; }>({});
  const [error, setError] = useState("");

  const { loggedInUser } = useUserContext();

  // Function to handle create release tag
  const createReleaseTag = async (data: IReleaseTag, setIsLoading: (loading: boolean) => void, isNotify = true) => {
    setError("");
    await requestHandler(
      async () => await createReleaseTagRequest({ ...data, organisationId: loggedInUser?.orgs[0]?.id }),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const releaseTagId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [releaseTagId]: data,
        }));
        setList(prevList => [releaseTagId, ...prevList]);
        isNotify && showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  // Function to handle get all release tags
  const getAllReleaseTags = async (setIsLoading: (loading: boolean) => void) => {
    await requestHandler(
      async () => await getAllReleaseTagsRequest({organisationId: loggedInUser?.orgs[0]?.id}),
      setIsLoading,
      (res: any) => {
        const { data } = res;
        const { releaseTags = [], ...metaData } = data as { releaseTags: IReleaseTag[], [key: string]: any; };

        const releaseTagMap = releaseTags.reduce((map: ReleaseTagMapType, releaseTag: IReleaseTag) => {
          map[releaseTag?.id!] = releaseTag;
          return map;
        }, {});
        const releaseTagIds = releaseTags.map((releaseTag) => releaseTag?.id!).filter(id => id);

        setMap(releaseTagMap);
        setList(releaseTagIds);
        setMetaData(metaData);
      },
      (errorMsg) => {
        console.log("get all release tags error: ", errorMsg);
        showNotification("error", errorMsg);
      }
    );
  };

  // Function to handle update release tag
  const updateReleaseTag = async (data: IReleaseTag, setIsLoading: (loading: boolean) => void) => {
    setError("");
    await requestHandler(
      async () => await updateReleaseTagRequest({ ...data, organisationId: loggedInUser?.orgs[0]?.id }),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const releaseTagId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [releaseTagId]: data,
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
  const deleteReleaseTag = async (id: number, setIsLoading: (loading: boolean) => void) => {
    setError("");
    await requestHandler(
      async () => await deleteReleaseTagRequest({ id, organisationId: loggedInUser?.orgs[0]?.id }),
      setIsLoading,
      (res: any) => {
        const { message } = res;
        const releaseTagId = id;

        setMap((prevMap) => ({
          ...prevMap,
          [releaseTagId]: null,
        }));
        setList(prevList => prevList.filter(id => id !== releaseTagId));
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
      getAllReleaseTags(() => { });
    }
  }, []);

  // Provide release tags-related data and functions through the context
  return (
    <ReleaseTagContext.Provider value={{
      error,
      map,
      list,
      metaData,
      createReleaseTag,
      getAllReleaseTags,
      updateReleaseTag,
      deleteReleaseTag
    }}>
      {children}
    </ReleaseTagContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { ReleaseTagContext, ReleaseTagProvider, useReleaseTagContext };
