import { apiClient } from ".";

const fileUploadRequest = (data: FormData) => {
    return apiClient.post("/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  export { fileUploadRequest };