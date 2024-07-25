import { ApiError } from "@/Utils/ApiError";
import { db } from "@/lib/db";

export default async function roleChecker(userId: number, projectId: number) {
  const projectUsers = await db.projectsUsers.findFirst({
    where: {
      projectsId: projectId!,
      usersId: userId,
    },
  });

  if (!projectUsers) {
    throw new ApiError(401, "Unauthorized request");
  }
}
