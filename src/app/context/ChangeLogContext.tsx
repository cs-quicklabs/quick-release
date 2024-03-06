"use client";

import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ChangeLogType } from "@/types";
import { requestHandler, showNotification } from "@/Utils";
import { createChangeLogRequest } from "@/api";

// Create a context to manage change logs-related data and functions
const ChangeLogContext = createContext({
  error: "",
  isLoading: false,
  map: {} as { [key: string]: ChangeLogType },
  list: [] as string[],
  metaData: {} as { [key: string]: any },
  createChangeLog: async (data: ChangeLogType, setIsLoading: (loading: boolean) => void) => { }
});

// Create a hook to access the ChangeLogContext
const useChangeLogContext = () => useContext(ChangeLogContext);

type ProviderProps = {
  children: ReactNode
}

// Create a component that provides change log related data and functions
const ChangeLogProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [map, setMap] = useState<{ [key: string]: ChangeLogType }>({});
  const [list, setList] = useState<string[]>([]);
  const [metaData, setMetaData] = useState({});

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
        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
        setError(errMessage);
      }
    );
  }

  // Provide change logs-related data and functions through the context
  return (
    <ChangeLogContext.Provider value={{
      error,
      isLoading,
      map,
      list,
      metaData,
      createChangeLog
    }}>
      {children}
    </ChangeLogContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { ChangeLogContext, ChangeLogProvider, useChangeLogContext };
