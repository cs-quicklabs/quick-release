import { privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: Response) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    const user = await db.users.findUnique({
      where: {
        cuid: userId,
      },
    })
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const body = await request.json();
    if(!body.organizationsId) {
      throw new ApiError(400, "organizations Id is required");
    }

    const organizations = await db.organizations.findFirst({
      where: {
        cuid: body.organizationsId,
        createdById: user?.id
      },
    })

    if(!organizations) {
      throw new ApiError(400, "Forbidden access");
    }

    if(!body.projects) {
      throw new ApiError(400, "Project name is required");
    }
    const existingProject = await db.projects.findFirst({
      where: { name: body.projects },
    });
    if (existingProject) {
      throw new ApiError(400, "Project name is already taken");
    }
    const project = await db.projects.create({
      data: {
        name: body.projects,
        createdById: user?.id,
        organizationsId: organizations?.id,
      },
    });

    const role = await db.usersRoles.findFirst({ where: { code: "SUPER_ADMIN" }});

    if (user?.id === undefined || project?.id === undefined || role?.id === undefined) {
      throw new ApiError(400, "Failed to create project");
    }

    const projectUser = await db.projectsUsers.create({
      data: {
        usersId: user?.id,
        projectsId: project.id,
        roleId: role?.id,
      }
    });
    return NextResponse.json(
      new ApiResponse(200, privacyResponse(project), "Project created successfully")
    );
  });
}
