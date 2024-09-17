import { db } from "./db";

export const getOneProject = async (
  query: { cuid: string } | { name: string }
) => {
  try {
    let queryObj;
    if ("name" in query) {
      queryObj = {
        slug: query.name,
      }
    }
    const project = await db.projects.findFirst({
      where: queryObj,
      include: {
        organizations: {
          select: {
            releaseTags: true,
            releaseCategories: true,
          },
        },
        feedbackBoards: {
          orderBy: [
            {
              isDefault: "desc",
            },
            {
              createdAt: "asc",
            },
          ],
        },
      },
    });

    return project;
  } catch (error: any) {
    throw error;
  }
};

