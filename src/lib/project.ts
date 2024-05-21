import { db } from "./db";

export const getOneProject = async (
  query: { id: string } | { name: string }
) => {
  try {
    const project = await db.project.findFirst({ where: query });

    return project;
  } catch (error: any) {
    throw error;
  }
};
