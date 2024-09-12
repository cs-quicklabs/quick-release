import { privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import roleChecker from "@/app/middleware/roleChecker";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: Response) {
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

    if (!body.id) {
      throw new ApiError(400, "Project Id is required");
    }

    if (body.name && body.name > 30) {
      throw new ApiError(400, "Project name must be less than 30 characters");
    }

    const project = await db.projects.findUnique({
      where: { cuid: body.id },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    await roleChecker(user?.id!, project?.id);

    if (body.slug) {
      if (body.slug !== project?.slug) {
        throw new ApiError(400, "Slug is not editable");
      }
    }

    const updateProject = await db.projects.update({
      where: {
        cuid: body.id,
      },
      data: {
        name: body.name,
        projectImgUrl: body.projectImgUrl,
      },
    });

    return NextResponse.json(
      new ApiResponse(
        200,
        privacyResponse(updateProject),
        "Team details updated successfully"
      )
    );
  });
}
