import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: Response) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const body = await request.json();
    if(!body.organisationId) {
      throw new ApiError(400, "Organisation Id is required");
    }

    const organisation = await db.organisation.findFirst({
      where: {
        id: body.organisationId,
        createdById: userId
      },
    })

    if(!organisation) {
      throw new ApiError(400, "Forbidden access");
    }

    if(!body.projects) {
      throw new ApiError(400, "Project name is required");
    }
    const existingProject = await db.project.findFirst({
      where: { name: body.projects },
    });
    if (existingProject) {
      throw new ApiError(400, "Project name is already taken");
    }
    const checkProjects = await db.project.findMany({
      where: {
        createdById: userId,
      },
    });

    const project = await db.project.create({
      data: {
        name: body.projects,
        createdById: userId,
        isActive: checkProjects.length === 0 ? true : false,
        organisationId: body.organisationId,
      },
    });

    if(!project) {
      throw new ApiError(400, "Failed to create project");
    }

    await db.projectUsers.create({
      data: {
        userId: userId,
        projectId: project.id,
        role: Role.SUPER_ADMIN,
      },
    });
    return NextResponse.json(
      new ApiResponse(200, { project }, "Project created successfully")
    );
  });
}
