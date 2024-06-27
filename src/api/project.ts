import { apiClient } from "./../Utils";

const getAllProjectsRequest = () => {
    return apiClient.get(`/projects/cu`);
  };
  
  const getOneActiveProjectRequest = () => {
    return apiClient.get("/projects/cu/active");
  };

  export {
    getAllProjectsRequest,
    getOneActiveProjectRequest
  }