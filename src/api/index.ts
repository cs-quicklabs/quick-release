import { ChangeLogType } from "@/types";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 120000,
});

// API functions for different actions

// project actions api's
const getAllProjectsRequest = (userId: string) => {
  return apiClient.get(`/get-projects/${userId}`);
};

const getOneActiveProjectRequest = (userId: string) => {
  return apiClient.get(`/get-active-project/${userId}`);
};

// changelog actions api's
const createChangeLogRequest = (data: ChangeLogType) => {
  return apiClient.post("/changelogs", data);
};

const getOneChangeLogRequest = (id: string) => {
  return apiClient.get(`/changelog/${id}`);
};

const deleteChangeLogRequest = (id: string) => {
  return apiClient.delete(`/changelog/${id}`);
};

const fileUploadRequest = (data: FormData) => {
  return apiClient.post("/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Export all the API functions
export {
  getAllProjectsRequest,
  getOneActiveProjectRequest,
  createChangeLogRequest,
  getOneChangeLogRequest,
  deleteChangeLogRequest,
  fileUploadRequest,
};
