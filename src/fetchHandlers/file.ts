import { apiClient } from ".";

const fileUploadRequest = (data: FormData) => {
  return apiClient.post("/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const fileDeleteRequest = (filePathUrls: string[], onModal: string) => {
  return apiClient.delete("/upload", {
    data: {
      filePathUrls,
      onModal,
    },
  });
};

export { fileUploadRequest, fileDeleteRequest };
