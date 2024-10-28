import { ChangeLogType } from "@/types";
import { REVALIDATE_API } from "@/Utils/constants";

export const computeChangeLog = (changelog: any) => {
  const releaseTags = changelog.releaseTags.map((tag: any) => tag.releaseTag);
  const releaseCategories = changelog.releaseCategories.map(
    (category: any) => category.releaseCategory
  );

  return Object.assign({}, changelog, {
    releaseTags,
    releaseCategories,
  });
};

export const getOneChangeLogDetails = async (
  projectName: string,
  id: string
): Promise<ChangeLogType | null> => {
  return fetch(
    `${process.env.BASEURL}/api/public/projects/${projectName}/changelogs/${id}`,
    { next: { revalidate: REVALIDATE_API } }
  )
    .then((response) => response.json())
    .then((resData) => (resData.success ? resData.data : null))
    .catch(() => null);
};
