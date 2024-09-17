export interface DropDownOptionType {
  readonly value: string;
  readonly label: string;
}

export interface IChangeLogPost extends FormChangeLogPost {
  id?: string;
  status: string;
  releaseCategories: string[];
}

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
  projects: Project[];
  verificationToken?: String;
  verificationTokenExpiry?: String;
  orgs: organizations[];
  activeProjectId?: String;
}

export interface organizations {
  id?: string;
  cuid?: string;
  name: string;
};

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
  name: string;
  slug: string;
  projectImgUrl: string;
  logs: Log[];
  User?: User;
  adminId?: string;
  isActive: Boolean;
}

export interface IReleaseTag {
  id?: number;
  name?: string;
  code?: string;
  organizationsId?: string;
}

export interface IReleaseCategory {
  id?: number;
  name?: string;
  code?: string;
  organizationsId?: string;
}

export interface IFeedbackBoard {
  id?: string;
  cuid?: string;
  name?: string;
  code?: string;
  isDefault?: boolean;
  projectsId?: String;
}
