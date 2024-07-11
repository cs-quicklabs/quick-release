"use client";

import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { requestHandler, showNotification } from "@/Utils";
import { useUserContext } from "./UserContext";
import { IReleaseCategory } from "@/interfaces";
import { createReleaseCategoriesRequest, deleteReleaseCategoriesRequest, getAllReleaseCategoriesRequest, updateReleaseCategoriesRequest } from "@/fetchHandlers/releaseCategory";

type ReleaseCategoryMapType = {
  [key: string]: IReleaseCategory | null;
};

// Create a context to manage change logs-related data and functions
const ReleaseCategoryContext = createContext({
  error: "",
  map: {} as ReleaseCategoryMapType,
  list: [] as number[],
  metaData: {} as { [key: string]: any; },
  createReleaseCategory: async (data: IReleaseCategory, setIsLoading: (loading: boolean) => void, isNotify = true) => { },
  getAllReleaseCategories: async (setIsLoading: (loading: boolean) => void) => { },
  updateReleaseCategory: async (data: IReleaseCategory, setIsLoading: (loading: boolean) => void) => { },
  deleteReleaseCategory: async (id: number, setIsLoading: (loading: boolean) => void) => { },
});

// Create a hook to access the ReleaseCategoryContext
const useReleaseCategoryContext = () => useContext(ReleaseCategoryContext);

type ProviderProps = {
  children: ReactNode;
};

// Create a component that provides change log related data and functions
const ReleaseCategoryProvider: React.FC<ProviderProps> = ({ children }) => {
  const [map, setMap] = useState<ReleaseCategoryMapType>({});
  const [list, setList] = useState<number[]>([]);
  const [metaData, setMetaData] = useState<{ [key: string]: any; }>({});
  const [error, setError] = useState("");

  const { loggedInUser } = useUserContext();

  // Function to handle create release tag
  const createReleaseCategory = async (data: IReleaseCategory, setIsLoading: (loading: boolean) => void, isNotify = true) => {
    setError("");
    await requestHandler(
      async () => await createReleaseCategoriesRequest({ ...data, organisationId: loggedInUser?.orgs[0]?.id }),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const releaseCategoryId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [releaseCategoryId]: data,
        }));
        setList(prevList => [releaseCategoryId, ...prevList]);
        isNotify && showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  };

  // Function to handle get all release tags
  const getAllReleaseCategories = async (setIsLoading: (loading: boolean) => void) => {
    await requestHandler(
      async () => await getAllReleaseCategoriesRequest({organisationId: loggedInUser?.orgs[0]?.id}),
      setIsLoading,
      (res: any) => {
        const { data } = res;
        const { releaseCategories = [], ...metaData } = data as { releaseCategories: IReleaseCategory[], [key: string]: any; };

        const releaseCategoryMap = releaseCategories.reduce((map: ReleaseCategoryMapType, releaseCategory: IReleaseCategory) => {
          map[releaseCategory?.id!] = releaseCategory;
          return map;
        }, {});
        const releaseCategoryIds = releaseCategories.map((releaseCategory) => releaseCategory?.id!).filter(id => id);

        setMap(releaseCategoryMap);
        setList(releaseCategoryIds);
        setMetaData(metaData);
      },
      (errorMsg) => {
        console.log("get all release tags error: ", errorMsg);
        showNotification("error", errorMsg);
      }
    );
  };

  // Function to handle update release tag
  const updateReleaseCategory = async (data: IReleaseCategory, setIsLoading: (loading: boolean) => void) => {
    setError("");
    await requestHandler(
      async () => await updateReleaseCategoriesRequest({ ...data, organisationId: loggedInUser?.orgs[0]?.id }),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const releaseCategoryId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [releaseCategoryId]: data,
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
  const deleteReleaseCategory = async (id: number, setIsLoading: (loading: boolean) => void) => {
    setError("");
    await requestHandler(
      async () => await deleteReleaseCategoriesRequest({ id, organisationId: loggedInUser?.orgs[0]?.id }),
      setIsLoading,
      (res: any) => {
        const { message } = res;
        const releaseCategoryId = id;

        setMap((prevMap) => ({
          ...prevMap,
          [releaseCategoryId]: null,
        }));
        setList(prevList => prevList.filter(id => id !== releaseCategoryId));
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
      getAllReleaseCategories(() => { });
    }
  }, []);

  // Provide release tags-related data and functions through the context
  return (
    <ReleaseCategoryContext.Provider value={{
      error,
      map,
      list,
      metaData,
      createReleaseCategory,
      getAllReleaseCategories,
      updateReleaseCategory,
      deleteReleaseCategory
    }}>
      {children}
    </ReleaseCategoryContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { ReleaseCategoryContext, ReleaseCategoryProvider, useReleaseCategoryContext };
