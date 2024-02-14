export type FormInputPost = {
  title: string;
  content: string;
  tagId: string;
};

export interface ReleaseTagsOption {
  readonly value: string;
  readonly label: string;
}
export type FormChangeLogPost = {
  title: string;
  description: string;
  releaseVersion: string;
  releaseTags: readonly ReleaseTagsOption[];
};

export interface User {
  createdAt: String;
  email: String;
  firstName: String;
  id: String;
  lastName: String;
  orgName: String;
  password: String;
  resetToken: String;
  resetTokenExpiry: String;
}
