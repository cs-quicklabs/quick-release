import { AuthType, ProfileType } from "@/types";
import { apiClient } from ".";
import { User } from "@/interfaces";

const getLoggedInUserDetailsRequest = () => {
  return apiClient.get("/users/current-user");
};

const updateLoggedInUserDetailsRequest = (data: ProfileType) => {
  return apiClient.patch("/users/current-user", data);
};

export { getLoggedInUserDetailsRequest, updateLoggedInUserDetailsRequest };
