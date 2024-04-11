import { ApiFilterQueryType, ChangeLogType, IReleaseTag } from "@/types";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 120000,
});

// API functions for different actions

// user profile actions api's
const getLoggedInUserDetailsRequest = () => {
  return apiClient.get("/users/current-user");
};

// project actions api's
const getAllProjectsRequest = () => {
  return apiClient.get(`/projects/cu`);
};

const getOneActiveProjectRequest = () => {
  return apiClient.get("/projects/cu/active");
};

// changelog actions api's
const createChangeLogRequest = (data: ChangeLogType) => {
  return apiClient.post("/changelogs", data);
};

const getAllChangeLogsRequest = (params: ApiFilterQueryType) => {
  return apiClient.get("/changelogs", { params });
};

const getOneChangeLogRequest = (id: string) => {
  return apiClient.get(`/changelogs/${id}`);
};

const updateOneChangeLogRequest = (data: ChangeLogType) => {
  return apiClient.put(`/changelogs/${data.id}`, data);
};

const publishOneChangeLogRequest = (id: string) => {
  return apiClient.post(`/changelogs/${id}/publish-now`);
};

const toggleArchiveOneChangeLogRequest = (id: string) => {
  return apiClient.post(`/changelogs/${id}/toggle-archive`);
};

const deleteOneChangeLogRequest = (id: string) => {
  return apiClient.delete(`/changelogs/${id}`);
};

const fileUploadRequest = (data: FormData) => {
  return apiClient.post("/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// release tags actions api's
const createReleaseTagRequest = (data: IReleaseTag) => {
  return apiClient.post("/release-tags", data);
};

const getAllReleaseTagsRequest = (params: ApiFilterQueryType) => {
  return apiClient.get("/release-tags", { params });
};

const updateReleaseTagRequest = (data: IReleaseTag) => {
  return apiClient.put(`/release-tags/${data.id}`, data);
};

const deleteReleaseTagRequest = (id: number) => {
  return apiClient.delete(`/release-tags/${id}`);
};

// public api's
const getAllPublicChangeLogsRequest = (params: ApiFilterQueryType) => {
  return apiClient.get(`public/projects/${params.projectName}/changelogs`, {
    params,
  });
};

// Export all the API functions
export {
  getLoggedInUserDetailsRequest,
  getAllProjectsRequest,
  getOneActiveProjectRequest,
  createChangeLogRequest,
  getAllPublicChangeLogsRequest,
  getAllChangeLogsRequest,
  getOneChangeLogRequest,
  updateOneChangeLogRequest,
  publishOneChangeLogRequest,
  toggleArchiveOneChangeLogRequest,
  deleteOneChangeLogRequest,
  fileUploadRequest,
  createReleaseTagRequest,
  getAllReleaseTagsRequest,
  updateReleaseTagRequest,
  deleteReleaseTagRequest,
};
