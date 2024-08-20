import { privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import roleChecker from "@/app/middleware/roleChecker";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type ParamsType = {
  id: string;
};

export async function PUT(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const cuid = params.id;

    if (!cuid) {
      throw new ApiError(400, "Feedback board Id is required");
    }

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const user = await db.users.findUnique({
      where: {
        cuid: userId,
      },
    });

    const body = await req.json();
    const name: string = body.name?.trim();
    if (!name) {
      throw new ApiError(400, "Board name is required");
    }

    if(name.length > 30) {
      throw new ApiError(400, "Board name must be less than 30 characters");
    }

    if (!body.projectsId) {
      throw new ApiError(400, "projects Id is required");
    }

    const project = await db.projects.findUnique({
      where: {
        cuid: body?.projectsId,
      },
    });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    await roleChecker(user?.id!, project?.id!);
    const feedbackBoard = await db.feedbackBoards.findFirst({
      where: {
        cuid,
        projectsId: project?.id,
      },
    });

    if (!feedbackBoard) {
      throw new ApiError(404, "Feedback board not found");
    }

    const existingBoard = await db.feedbackBoards.findFirst({
      where: {
        name,
        projectsId: project?.id,
      },
    });
    if (existingBoard) {
      throw new ApiError(400, "Feedback board with this name already exists");
    }

    const updatedFeedbackBoard = await db.feedbackBoards.update({
      where: { cuid },
      data: {
        name,
      },
      select: {
        id: true,
        cuid: true,
        name: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      new ApiResponse(
        200,
        privacyResponse(updatedFeedbackBoard),
        "Feedback board updated successfully"
      )
    );
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const cuid = params.id;

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await db.users.findUnique({
      where: {
        cuid: userId,
      },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const projectsId = req.nextUrl.searchParams.get("projectsId");

    if (!projectsId) {
      throw new ApiError(400, "Missing field projectsId");
    }

    const project = await db.projects.findFirst({
      where: {
        cuid: projectsId,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    await roleChecker(user?.id!, project?.id!);

    if (!project?.id) {
      throw new ApiError(404, "project not found");
    }

    const feedbackBoard = await db.feedbackBoards.findFirst({
      where: {
        cuid,
        projectsId: project?.id,
      },
      select: {
        feedbackPosts: {
          select: {
            id: true,
          },
        },
        id: true,
        isDefault: true,
      },
    });
    if (!feedbackBoard) {
      throw new ApiError(404, "Feedback board not found");
    }

    if(feedbackBoard?.isDefault) {
      throw new ApiError(400, "Default feedback board cannot be deleted");
    }

    if (feedbackBoard?.feedbackPosts.length > 0) {
      throw new ApiError(
        400,
        "Cannot delete feedback board with feedback posts"
      );
    }

    await db.feedbackBoards.delete({ where: { id: feedbackBoard.id } });

    return NextResponse.json(
      new ApiResponse(200, null, "Feedback board deleted successfully")
    );
  });
}
