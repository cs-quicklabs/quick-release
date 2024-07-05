export type FormInputPost = {
  title: string;
  content: string;
  tagId: string;
};

export type FormChangeLogPost = {
  title: string;
  description: string;
  releaseVersion: string;
  releaseCategories: readonly IReleaseCategoriesOption[];
  releaseTags: readonly ReleaseTagsOption[];
  scheduledTime?: Date;
};

export type AuthType = {
  email: string;
  password: string;
  confirmPassword?: string;
}

export type ChangeLogType = {
  id?: string;
  title: string;
  description: string;
  releaseVersion: string;
  releaseCategories: string[];
  releaseTags: string[] | IReleaseTag[];

  project?: Project;
  projectId: string;

  scheduledTime?: Date;

  status: string;

  createdAt?: Date;
  updatedAt?: Date;

  deletedAt?: Date;

  createdBy?: User;
  archivedAt?: Date;
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

export type ReleaseCategoryType = {
  value: string;
  label: string;
  textColor: string;
  bgColor: string;
};

export type ReleaseTagType = {
  value: string;
  label: string;
};

export type ApiFilterQueryType = {
  page?: number;
  limit?: number;
  [key: string]: any;
  organisationId?: string;
};
