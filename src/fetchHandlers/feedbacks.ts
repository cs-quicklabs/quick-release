import { ApiFilterQueryType, FeedbackPostType } from "@/types";
import { IFeedbackBoard } from "@/interfaces";
import { apiClient } from ".";

// release tags actions api's
const createFeedbackBoardRequest = (data: IFeedbackBoard) => {
  return apiClient.post("/feedbacks/boards", data);
};

const getAllFeedbackBoardsRequest = (params: ApiFilterQueryType) => {
  return apiClient.get("/feedbacks/boards", { params });
};
const updateFeedbackBoardRequest = (data: IFeedbackBoard) => {
  return apiClient.put(`/feedbacks/boards/${data.id}`, data);
};

const deleteFeedbackBoardRequest = (data: IFeedbackBoard) => {
  return apiClient.delete(`/feedbacks/boards/${data.id}`, {
    params: { projectsId: data.projectsId },
  });
};

const createFeedbackPostRequest = (data: FeedbackPostType) => {
  return apiClient.post("/feedbacks/posts", data);
};

const getAllFeedbackPostsRequest = (params: ApiFilterQueryType) => {
  return apiClient.get("/feedbacks/posts", { params });
};

const getOneFeedbackPostRequest = (id: string, params: ApiFilterQueryType) => {
  return apiClient.get(`/feedbacks/posts/${id}`, { params });
};

export {
  createFeedbackBoardRequest,
  getAllFeedbackBoardsRequest,
  updateFeedbackBoardRequest,
  deleteFeedbackBoardRequest,
  createFeedbackPostRequest,
  getAllFeedbackPostsRequest,
  getOneFeedbackPostRequest,
};
