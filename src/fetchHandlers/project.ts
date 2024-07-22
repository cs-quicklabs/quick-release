import { apiClient } from ".";

const createProjectRequest = (data: any) => {
    return apiClient.post("/projects/cu/create", data);
};

const setActiveProjectRequest = (id: string) => {
    return apiClient.patch(`/projects/cu/active/${id}`);
};

const getAllProjectsRequest = () => {
    return apiClient.get(`/projects/cu`);
  };
  
  const getOneActiveProjectRequest = () => {
    return apiClient.get("/projects/cu/active");
  };

  export {
    getAllProjectsRequest,
    getOneActiveProjectRequest,
    createProjectRequest,
    setActiveProjectRequest
  }