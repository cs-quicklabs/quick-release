import { ApiFilterQueryType, ChangeLogType } from "@/types";
import { apiClient } from ".";

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

  const getAllPublicChangeLogsRequest = (params: ApiFilterQueryType) => {
    return apiClient.get(`public/projects/${params.projectName}/changelogs`, {
      params,
    });
  };


  export {
    createChangeLogRequest,
    getAllChangeLogsRequest,
    getOneChangeLogRequest,
    updateOneChangeLogRequest,
    publishOneChangeLogRequest,
    toggleArchiveOneChangeLogRequest,
    deleteOneChangeLogRequest,
    getAllPublicChangeLogsRequest
  }