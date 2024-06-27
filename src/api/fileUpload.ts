import { apiClient } from "./../Utils";

const fileUploadRequest = (data: FormData) => {
    return apiClient.post("/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  export { fileUploadRequest };