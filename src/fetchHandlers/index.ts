import { requestHandler, showNotification } from "@/Utils";
import axios from "axios";
import { fileDeleteRequest, fileUploadRequest } from "./file";
import { IsAny } from "react-hook-form";

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 120000,
});

export const uploadFile = async (
  file: File,
  onModal: string,
  setIsLoading: (IsLoading: boolean) => void
) => {
  setIsLoading(true);
  const extension = file.name.toLowerCase().split(".").pop();
  if (!["png", "jpg", "jpeg"].includes(extension!)) {
    const errMessage = "Invalid file type";
    showNotification("error", errMessage);
    setIsLoading(false);
    return;
  }

  if (file.size > 1024 * 1024 * 3) {
    const errMessage = "File size should be less than 3 MB";
    showNotification("error", errMessage);
    setIsLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("onModal", onModal);

  try {
    const response = await fileUploadRequest(formData);
    return response.data.data.url;
  } catch (err: any) {
    const errMessage = err?.response?.data?.message || "Something went wrong";
    showNotification("error", errMessage);
    return;
  } finally {
    setIsLoading(false);
  }
};

export const deleteFiles = async (
  pathUrls: string[],
  onModal: string,
  setIsLoading: (IsLoading: boolean) => void
) => {
  setIsLoading(true);
  try {
    const response = await fileDeleteRequest(pathUrls, onModal);
    console.log(response.data);
    return response.data.data;
  } catch (err: any) {
    const errMessage = err?.response?.data?.message || "Something went wrong";
    showNotification("error", errMessage);
    return;
  } finally {
    setIsLoading(false);
  }
};
