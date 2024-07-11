import {
  ReleaseCategoryType,
  ChangeLogsStatusType,
  ReleaseTagType,
} from "@/types";

export const ChangeLogsReleaseCategories = Object.freeze<{
  [key: string]: ReleaseCategoryType;
}>({
  new: {
    value: "new",
    label: "New",
    textColor: "text-green-800",
    bgColor: "bg-green-100",
  },
  improvement: {
    value: "improvement",
    label: "Improvement",
    textColor: "text-gray-800",
    bgColor: "bg-gray-100",
  },
  bug_fix: {
    value: "bug_fix",
    label: "Bug Fix",
    textColor: "text-red-800",
    bgColor: "bg-red-100",
  },
  maintenance: {
    value: "maintenance",
    label: "Maintenance",
    textColor: "text-indigo-800",
    bgColor: "bg-indigo-100",
  },
  refactor: {
    value: "refactor",
    label: "Refactor",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-100",
  },
});

export const ChangeLogsReleaseTags = Object.freeze<{
  [key: string]: ReleaseTagType;
}>({
  ios: {
    value: "ios",
    label: "iOS",
  },
  android: {
    value: "android",
    label: "Android",
  },
  web: {
    value: "web",
    label: "Web",
  },
});

export const ChangeLogsReleaseActions = Object.freeze({
  published: {
    id: "published",
    title: "Publish Now",
    description: "Publish your change log now",
    btnText: "Publish Changelog Now",
  },
  draft: {
    id: "draft",
    title: "Save as Draft",
    description: "Save as draft and edit in future",
    btnText: "Save as Draft Changelog",
  },
  scheduled: {
    id: "scheduled",
    title: "Schedule",
    description:
      "Schedule your release to publish automatically on specified date",
    btnText: "Schedule Changelog",
  },
});

export const ChangeLogsStatus = Object.freeze<ChangeLogsStatusType>({
  published: {
    id: "published",
    title: "Published",
    textColor: "text-green-800",
    bgColor: "bg-green-100",
    bulletColor: "bg-green-400",
  },
  draft: {
    id: "draft",
    title: "Draft",
    textColor: "text-yellow-800",
    bgColor: "bg-yellow-100",
    bulletColor: "bg-yellow-400",
  },
  scheduled: {
    id: "scheduled",
    title: "Scheduled",
    textColor: "text-gray-800",
    bgColor: "bg-gray-100",
    bulletColor: "bg-gray-400",
  },
  archived: {
    id: "archived",
    title: "Archived",
    textColor: "text-red-800",
    bgColor: "bg-red-100",
    bulletColor: "bg-red-400",
  },
});

// select user details from db only which are alow to view publish
export const SelectUserDetailsFromDB = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  profilePicture: true,
};

export const WEB_DETAILS = {
  name: "Quick Release",
  description: "Manage your release notes better",
  logo: "/icons/qr-logo1.svg",
  favicon: "/icons/favicon.svg",
};
export const ChangeLogIncludeDBQuery = {
  project: { select: { id: true, name: true } },
  createdBy: { select: SelectUserDetailsFromDB },
  updatedBy: { select: SelectUserDetailsFromDB },
  releaseTags: {
    select: {
      releaseTag: {
        select: {
          code: true,
          name: true,
        },
      },
    },
  },
  releaseCategories: {
    select: {
      releaseCategory: {
        select: {
          code: true,
          name: true,
          textColor: true,
          bgColor: true,
        },
      },
    },
  },
};

export const REVALIDATE_API = 10; // revalidate/cache api response for 60 seconds
