import { ApiFilterQueryType } from "@/types";
import { IFeedbackBoard } from "@/interfaces";
import { apiClient } from ".";

// release tags actions api's
const createFeedbackBoardRequest = (data: IFeedbackBoard) => {
  return apiClient.post("/feedbacks/boards", data);
};

const getAllFeedbackBoardsRequest = (params: ApiFilterQueryType) => {
  console.log(params)
  return apiClient.get("/feedbacks/boards", { params });
};
const updateFeedbackBoardRequest = (data: IFeedbackBoard) => {
  return apiClient.put(`/feedbacks/boards/${data.id}`, data);
};

const deleteFeedbackBoardRequest = (data: IFeedbackBoard) => {
  return apiClient.delete(`/feedbacks/boards/${data.id}`, { params : { projectsId : data.projectsId } });
};

export {
  createFeedbackBoardRequest,
  getAllFeedbackBoardsRequest,
  updateFeedbackBoardRequest,
  deleteFeedbackBoardRequest,
};
