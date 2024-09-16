import { IReleaseCategory, DropDownOptionType } from "@/interfaces";

export type FormInputPost = {
  title: string;
  content: string;
  tagId: string;
};

export type FormChangeLogPost = {
  title: string;
  description: string;
  releaseVersion: string;
  releaseCategories: readonly DropDownOptionType[];
  releaseTags: readonly DropDownOptionType[];
  scheduledTime?: Date;
};

export type FeedbackPostForm = {
  feedbackBoard: readonly DropDownOptionType;
  title: string;
  description: string;
  status: readonly DropDownOptionType;
  feedbackboardsId?: string;
  releaseETA?: Date;
  releaseTags?: readonly DropDownOptionType[];
  visibilityStatus?: readonly DropDownOptionType;
};

export type AuthType = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type ProfileType = {
  firstName?: String;
  lastName?: String;
  profilePicture?: String | null;
  email?: String;
};

export type ChangeLogType = {
  id?: string;
  title: string;
  description: string;
  releaseVersion: string;
  releaseCategories: string[] | IReleaseCategory[];
  releaseTags: string[] | IReleaseTag[];

  projects?: Project;
  projectsId: string;

  scheduledTime?: Date;

  status: string;
  organizationsId?: string;
  createdAt?: Date;
  updatedAt?: Date;

  deletedAt?: Date;

  createdBy?: User;
  archivedAt?: Date;
};

export type FeedbackPostType = {
  id?: string;
  title: string;
  description: string;
  projects?: Project;
  projectsId?: String;
  releaseETA?: Date;
  status: string;
  feedbackBoards?: FeedbackBoardType;
  feedbackBoardsId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: User;
  releaseTags?: IReleaseTag[];
  visibilityStatus?: string;
  upvotedCount?: number;
  isUpvoted?: boolean;
  projectName?: string;
};

export type ProjectDetailsType = {
  id: string;
  name?: string;
  slug?: string;
  projectImgUrl?: string | null;
}

export type FeedbackStatusUpdatePayloadType = {
  id: string;
  status: string;
  projectsId: string;
};

export type FeedbackBoardType = {
  id?: string;
  cuid?: string;
  name: string;
  label: string;
  value: string;
  projects?: Project;
  projectsId?: String;
};

export type ChangeLogsStatusType = {
  [key: string]: {
    id: string;
    title: string;
    textColor: string;
    bgColor: string;
    bulletColor: string;
  };
};

FeedbackStatusType;
export type FeedbackStatusType = {
  [key: string]: {
    id: string;
    title: string;
    textColor: string;
    bgColor: string;
    bulletColor: string;
  };
};

export type ReleaseCategoryType = {
  value: string;
  label: string;
};

export type ReleaseTagType = {
  value: string;
  label: string;
};

export type ApiFilterQueryType = {
  page?: number;
  limit?: number;
  [key: string]: any;
  organizationsId?: String;
  projectsId?: String;
};

export type FilterType = {
  projectId?: string;
  [key: string]: any;
};
