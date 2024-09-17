"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createProjectRequest,
  getAllProjectsRequest,
  getOneActiveProjectRequest,
  setActiveProjectRequest,
  updateProjectRequest,
} from "@/fetchHandlers/project";
import { requestHandler, showNotification } from "@/Utils";
import { Project } from "@/interfaces";
import { useUserContext } from "./UserContext";
import { useRouter } from "next/navigation";
import { ProjectDetailsType } from "@/types";

type ProjectMapType = {
  [key: string]: Project | null;
};

type ProjectContextType = {
  isLoading: boolean;
  map: ProjectMapType;
  list: string[];
  meta: { [key: string]: any };
  activeProjectId: string | null;
  createProject: (values: Project) => Promise<void>;
  updateProjectDetails: (values: ProjectDetailsType) => Promise<void>;
  getAllProjects: () => Promise<void>;
  getActiveProject: (
    setIsLoading: ((loading: boolean) => void) | null
  ) => Promise<void>;
  setActiveProject: (projectId: string) => void;
};

// Create a context to manage projects-related data and functions
const ProjectContext = createContext<ProjectContextType>({
  isLoading: false,
  map: {},
  list: [],
  meta: {},
  activeProjectId: null,
  createProject: async (values: Project) => {},
  updateProjectDetails: async (values: ProjectDetailsType) => {},
  getAllProjects: async () => {},
  getActiveProject: async (
    setIsLoading: ((loading: boolean) => void) | null
  ) => {},
  setActiveProject: (projectId: string) => {},
});

// Create a hook to access the ProjectContext
const useProjectContext = () => useContext(ProjectContext);

type ProviderProps = {
  children: ReactNode;
};

// Create a component that provides project-related data and functions
const ProjectProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState<ProjectMapType>({});
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [list, setList] = useState<string[]>([]);
  const [meta, setMeta] = useState({});
  const router = useRouter();

  const { loggedInUser } = useUserContext();

  const createProject = async (values: Project) => {
    await requestHandler(
      async () =>
        await createProjectRequest({
          ...values,
          organizationsId: loggedInUser?.orgs[0]?.id,
        }),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const projectId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [projectId]: data,
        }));
        setList((prevList) => [projectId, ...prevList]);
        setActiveProject(projectId);
        showNotification("success", message);
        router.push(`/allLogs`);
      },
      (errorMsg) => {
        console.log("error:", errorMsg);
        showNotification("error", errorMsg);
      }
    );
  };

  // Function to handle get all projects details
  const getAllProjects = async () => {
    await requestHandler(
      async () => await getAllProjectsRequest(),
      setIsLoading,
      (res: any) => {
        const { data } = res;
        const { projects = [], ...metaData } = data as {
          projects: Project[];
          [key: string]: any;
        };

        const projectMap = projects.reduce(
          (map: ProjectMapType, project: Project) => {
            map[project?.id as string] = project;
            return map;
          },
          {}
        );
        const projectIds = projects
          .map((project) => project?.id)
          .filter((id) => id) as string[];

        setMap(projectMap);
        setList(projectIds);
        setMeta(metaData);
        setActiveProjectId((prevProjectId) => {
          if (prevProjectId && projectIds.includes(prevProjectId)) {
            return prevProjectId;
          } else {
            return projectIds[0] ?? null;
          }
        });
      },
      (errorMsg) => {
        console.log("get all projects error: ", errorMsg);
        showNotification("error", errorMsg);
      }
    );
  };

  // Function to handle get active project details
  const getActiveProject = async (
    setIsLoading: ((loading: boolean) => void) | null
  ) => {
    await requestHandler(
      async () => await getOneActiveProjectRequest(),
      setIsLoading,
      (res: any) => {
        const { data } = res;
        const projectId = data.id!;

        setMap((prevMap) => ({
          ...prevMap,
          [projectId]: data,
        }));
        setActiveProjectId(projectId);
      },
      (errorMsg) => {
        console.log("getActiveProject", errorMsg);
      }
    );
  };

  const setActiveProject = async (projectId: string) => {
    const prevActiveProjectId = activeProjectId;
    setActiveProjectId(projectId);
    await requestHandler(
      async () => await setActiveProjectRequest(projectId),
      setIsLoading,
      (res: any) => {
        const { data } = res;
        const projectId = data.id!;
        setMap((prevMap) => ({
          ...prevMap,
          [projectId]: data,
        }));
      },
      (errMessage: any) => {
        showNotification("error", errMessage);
        setActiveProjectId(prevActiveProjectId);
      }
    );
  };

  const updateProjectDetails = async (values: ProjectDetailsType) => {
    await requestHandler(
      async () => await updateProjectRequest(values),
      setIsLoading,
      (res: any) => {
        const { data, message } = res;
        const projectId = data.id!;
        setMap((prevMap) => ({
          ...prevMap,
          [projectId]: data,
        }));

        showNotification("success", message);
      },
      (errMessage) => {
        showNotification("error", errMessage);
      }
    );
  };

  useEffect(() => {
    if (loggedInUser) {
      getAllProjects();
    }
  }, [loggedInUser]);

  // Provide project-related data and functions through the context
  return (
    <ProjectContext.Provider
      value={{
        activeProjectId,
        isLoading,
        map,
        list,
        meta,
        createProject,
        updateProjectDetails,
        getAllProjects,
        getActiveProject,
        setActiveProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Export the context, provider component, and custom hook
export { ProjectContext, ProjectProvider, useProjectContext };
