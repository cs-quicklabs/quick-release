import { ApiFilterQueryType, ChangeLogType } from "@/types";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 120000,
});

// API functions for different actions

const forgetPasswordRequest = (data: { email: string }) => {
  return apiClient.post("/forget-password", data);
}

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

// Export all the API functions
// Export all the API functions
export {
  getLoggedInUserDetailsRequest,
  getAllProjectsRequest,
  getOneActiveProjectRequest,
  createChangeLogRequest,
  getAllChangeLogsRequest,
  getOneChangeLogRequest,
  publishOneChangeLogRequest,
  toggleArchiveOneChangeLogRequest,
  deleteOneChangeLogRequest,
  fileUploadRequest, 
  forgetPasswordRequest,
};
