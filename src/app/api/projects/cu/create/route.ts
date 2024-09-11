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
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await db.users.findUnique({
      where: {
        cuid: userId,
      },
    });
    const body = await request.json();
    if (!body.organizationsId) {
      throw new ApiError(400, "organizations Id is required");
    }

    const organizations = await db.organizations.findFirst({
      where: {
        cuid: body.organizationsId,
        createdById: user?.id,
      },
    });

    if (!organizations) {
      throw new ApiError(400, "Forbidden access");
    }

    if (!body.name) {
      throw new ApiError(400, "Project name is required");
    }

    if (body.name.length > 30) {
      throw new ApiError(400, "Project name must be less than 30 characters");
    }

    if (!body.slug) {
      throw new ApiError(400, "Project slug is required");
    }

    if (body.slug.length > 30) {
      throw new ApiError(400, "Project slug must be less than 30 characters");
    }

    const existingProject = await db.projects.findFirst({
      where: { slug: body.slug },
    });
    if (existingProject) {
      throw new ApiError(400, "Project slug is already taken");
    }
    const project = await db.projects.create({
      data: {
        name: body.name,
        slug: body.slug,
        projectImgUrl: body.projectImgUrl,
        createdById: user?.id,
        organizationsId: organizations?.id,
      },
    });

    const role = await db.usersRoles.findFirst({
      where: { code: "SUPER_ADMIN" },
    });

    if (
      user?.id === undefined ||
      project?.id === undefined ||
      role?.id === undefined
    ) {
      throw new ApiError(400, "Failed to create project");
    }

    const projectUser = await db.projectsUsers.create({
      data: {
        usersId: user?.id,
        projectsId: project.id,
        roleId: role?.id,
      },
    });

    await db.feedbackBoards.create({
      data: {
        name: "Feature Requests",
        projectsId: project.id,
        isDefault: true,
      },
    });
    return NextResponse.json(
      new ApiResponse(
        200,
        privacyResponse(project),
        "Project created successfully"
      )
    );
  });
}
