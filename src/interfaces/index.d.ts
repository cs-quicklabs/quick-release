export interface IReleaseCategoriesOption {
    value: string;
    label: string;
  }
  
  export interface ReleaseTagsOption {
    readonly value: string;
    readonly label: string;
  }

  export interface ReleaseCategoriesOption {
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
    id?: number;
    name?: string;
    code?: string;
    isDefault?: boolean;
    projectsId?: String;
  }

  