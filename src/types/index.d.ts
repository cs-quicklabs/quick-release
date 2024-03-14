export type FormInputPost = {
  title: string;
  content: string;
  tagId: string;
};

export interface IReleaseCategoriesOption {
  value: string;
  label: string;
}

export interface ReleaseTagsOption {
  readonly value: string;
  readonly label: string;
}
export type FormChangeLogPost = {
  title: string;
  description: string;
  releaseVersion: string;
  releaseCategories: readonly IReleaseCategoriesOption[];
  releaseTags: readonly ReleaseTagsOption[];
  scheduledTime?: Date;
};

export interface IChangeLogPost extends FormChangeLogPost {
  id?: string;
  status: string;
  releaseCategories: string[];
}

export type ChangeLogType = {
  id?: string;
  title: string;
  description: string;
  releaseVersion: string;
  releaseCategories: string[];
  releaseTags: string[];
  projectId: string;
  scheduledTime?: Date;

  status: string;

  createdAt?: Date;
  updatedAt?: Date;

  deletedAt?: Date;

  createdBy?: User;
  isArchived?: boolean;
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

export interface User {
  id: String;
  createdAt: DateTime;
  updatedAt: DateTime;
  firstName: String;
  lastName: String;
  profilePicture?: String;
  email: String;
  password: String;
  resetToken?: String;
  resetTokenExpiry?: String;
  isActive: Boolean;
  isVerified: Boolean;
  role: String;
  organisationId: String;
  organisation?: Organisation;
  projects: Project[];
  verificationToken?: String;
  verificationTokenExpiry?: String;
}

export interface IFile {
  encoding: string;
  buffer: Buffer;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface Project {
  id: String;
  createdAt: DateTime;
  updatedAt: DateTime;
  name: String;
  logs: Log[];
  User?: User;
  adminId?: String;
  isActive: Boolean;
}

export type ApiFilterQueryType = {
  page?: number;
  limit?: number;
  [key: string]: any;
};
