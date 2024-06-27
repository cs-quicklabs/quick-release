import { AuthType } from "@/types";
import { apiClient } from "./../Utils";


const registerUserRequest = (data: any) => {
    return apiClient.post("/register", data);
  };
  
  const verifyRegisterTokenRequest = (data: any) => {
    return apiClient.post("/verify-register-token", data);
  };
  
  const resendVerificationLinkRequest = (data: any) => {
    return apiClient.post("/resend-verification-link", data);
  };
  
  const forgetPasswordRequest = (data: { email: string }) => {
    return apiClient.post("/forget-password", data);
  };
  
  const resetPasswordRequest = (data: AuthType) => {
    return apiClient.post("/reset-password", data);
  };
  
  const verifyResetTokenRequest = (data: any) => {
    return apiClient.post("/verify-token", data);
  };
  
  const changePasswordRequest = (data: any, userId: string) => {
    return apiClient.post(`/change-password/${userId}`, data);
  }

  const getLoggedInUserDetailsRequest = () => {
    return apiClient.get("/users/current-user");
  };


  export {
    registerUserRequest,
    verifyRegisterTokenRequest,
    resendVerificationLinkRequest,
    forgetPasswordRequest,
    resetPasswordRequest,
    verifyResetTokenRequest,
    changePasswordRequest,
    getLoggedInUserDetailsRequest
  }