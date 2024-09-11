import {
  ApiFilterQueryType,
  FeedbackPostType,
  FeedbackStatusUpdatePayloadType,
} from "@/types";
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

const updateFeedbackPostRequest = (data: FeedbackPostType) => {
  return apiClient.put(`/feedbacks/posts/${data.id}`, data);
};

const deleteFeedbackPostRequest = (id: string, projectsId: string) => {
  return apiClient.delete(`/feedbacks/posts/${id}`, {
    params: { projectsId },
  });
};

const upvoteFeedbackRequest = (id: string, projectsId: string) => {
  return apiClient.post(`/feedbacks/posts/${id}/upvote`, { projectsId });
};

const getAllPublicFeedbacksRequest = (params: ApiFilterQueryType) => {
  return apiClient.get(`public/projects/${params.projectName}/feedbacks`, {
    params,
  });
};

const updateFeedbackStatusRequest = (data: FeedbackStatusUpdatePayloadType) => {
  return apiClient.patch(`/feedbacks/posts/${data.id}`, data);
};

export {
  createFeedbackBoardRequest,
  getAllFeedbackBoardsRequest,
  updateFeedbackBoardRequest,
  deleteFeedbackBoardRequest,
  createFeedbackPostRequest,
  getAllFeedbackPostsRequest,
  getOneFeedbackPostRequest,
  updateFeedbackPostRequest,
  deleteFeedbackPostRequest,
  upvoteFeedbackRequest,
  getAllPublicFeedbacksRequest,
  updateFeedbackStatusRequest,
};
