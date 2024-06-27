import { apiClient } from ".";

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