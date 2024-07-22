import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params: { projectId } }: { params: { projectId: string } }
) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    if (!projectId) {
      throw new ApiError(400, "Project Id is required");
    }

    const user = await db.users.findUnique({
      where: {
        cuid: userId,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const project = await db.projects.findFirst({
      where: {
        cuid: projectId,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Update all project users to inactive for the user
    await db.projectsUsers.updateMany({
      data: {
        isActive: false,
      },
      where: {
        usersId: user.id,
      },
    });

    // Find the specified project user
    const projectUser = await db.projectsUsers.findFirst({
      where: {
        usersId: user.id,
        projectsId: project.id,
      },
    });

    // Update the specified project user to active
    const activeProject = await db.projectsUsers.update({
      data: {
        isActive: true,
      },
      where: {
        usersId_projectsId_roleId: {
          usersId: user.id,
          projectsId: project.id,
          roleId: projectUser?.roleId!,
        },
      },
    });

    if (!activeProject) {
      throw new ApiError(400, "Failed to activate project");
    }

    return NextResponse.json(
      new ApiResponse(200, "Project activated successfully")
    );
  });
}
