import { ApiFilterQueryType } from "@/types";
import { IReleaseCategory } from "@/interfaces";
import { apiClient } from ".";

// release tags actions api's
const createReleaseCategoriesRequest = (data: IReleaseCategory) => {
  return apiClient.post("/release-categories", data);
};

const getAllReleaseCategoriesRequest = (params: ApiFilterQueryType) => {
  return apiClient.get("/release-categories", { params });
};

const updateReleaseCategoriesRequest = (data: IReleaseCategory) => {
  return apiClient.put(`/release-categories/${data.id}`, data);
};

const deleteReleaseCategoriesRequest = (data: IReleaseCategory) => {
  return apiClient.delete(`/release-categories/${data.id}`, { params : { organisationId: data.organisationId } });
};

export {
  createReleaseCategoriesRequest,
  getAllReleaseCategoriesRequest,
  updateReleaseCategoriesRequest,
  deleteReleaseCategoriesRequest,
};
