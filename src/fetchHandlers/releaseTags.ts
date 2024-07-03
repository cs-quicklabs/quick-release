import { ApiFilterQueryType } from "@/types";
import { IReleaseTag } from "@/interfaces";
import { apiClient } from ".";

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

export {
  createReleaseTagRequest,
  getAllReleaseTagsRequest,
  updateReleaseTagRequest,
  deleteReleaseTagRequest,
};
