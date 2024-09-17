import { AxiosResponse } from "axios";
import { toast, TypeOptions } from "react-toastify";

export const showNotification = (type: TypeOptions, message: string) => {
  toast.dismiss();
  setTimeout(() => {
    toast(message, {
      type,
      closeOnClick: true,
    })
  }, 500);
};

export const requestHandler = async (
  api: () => Promise<AxiosResponse<any, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: any) => void,
  onError: (errorMessage: string) => void
) => {
  toast.dismiss();
  setLoading?.(true);
  try {
    const response = await api();
    const { data } = response;

    if (data?.success) {
      onSuccess(data);
    }
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "Something went wrong";
    onError(errorMessage);
  } finally {
    // Hide loading state if setLoading function is provided
    setLoading?.(false);
  }
};

export const checkRichTextEditorIsEmpty = (text: string) => {
  const withoutTags = text.replace(/(<([^>]+)>)/gi, "");
  return withoutTags.trim().length > 0;
};

export const getRolesCode = (text: string) => {
  return text.toUpperCase().replaceAll(" ", "_");
};

export const getReleaseKeyCode = (tagName: string) => {
  return tagName.toLowerCase().replaceAll(" ", "_");
};
export const isValidArray = (compareArray: string[], validArray: string[]) => {
  return compareArray.every((compareItem) => validArray.includes(compareItem));
};

export const selectedData = (userData: any) => {
  return {
    id: userData?.id,
    name: userData?.firstName + " " + userData?.lastName,
    profilePicture: userData?.profilePicture,
    email: userData?.email,
    role: userData?.role,
    isActive: userData?.isActive,
    isVerified: userData?.isVerified,
  };
};

export const handleTrancate = (text: string, trucateNum: number) => {
  if (text.length > trucateNum) {
    return `${text.slice(0, trucateNum)}...`;
  }
  return text;
};

export const privacyResponse = (data: any) => {
  const {
    id,
    cuid,
    password,
    organizationsId,
    createdById,
    projectsId,
    feedbackBoardsId,
    resetToken,
    resetTokenExpiry,
    verificationToken,
    verificationTokenExpiry,
    ...rest
  } = data;
  return {
    id: cuid,
    ...rest,
  };
};

export const privacyResponseArray = (data: any) => {
  return data.map((item: any) => {
    const {
      id,
      cuid,
      password,
      organizationsId,
      createdById,
      projectsId,
      feedbackBoardsId,
      resetToken,
      resetTokenExpiry,
      verificationToken,
      verificationTokenExpiry,
      ...rest
    } = item;
    return {
      id: cuid,
      ...rest,
    };
  });
};

export function extractImageUrls(htmlString: string): string[] {
  const imgTagRegex = /<img [^>]*src="([^"]+)"[^>]*>/gi;
  const urls: string[] = [];
  let match;

  while ((match = imgTagRegex.exec(htmlString)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

export const updateQueryParams = (
  board: string | null,
  search: string | null,
  sort: string | null
) => {
  let queryParams = "";
  if (board) {
    queryParams += `board=${board}`;
  }

  if (search) {
    if (queryParams) queryParams += "&";
    queryParams += `search=${search}`;
  }

  if (sort) {
    if (queryParams) queryParams += "&";
    queryParams += `sort=${sort}`;
  }

  return queryParams;
};
