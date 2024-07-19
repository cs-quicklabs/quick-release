import { db } from "./db";

export const getOneProject = async (
  query: { cuid: string } | { name: string }
) => {
  try {
    const project = await db.projects.findFirst({
      where: query,
      include: {
        organizations: {
          select: {
            releaseTags: true,
            releaseCategories: true,
          },
        }
      },
    });

    return project;
  } catch (error: any) {
    throw error;
  }
};
