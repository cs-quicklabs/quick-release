import { isValidArray, privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { FeedbackPostIncludeDBQuery } from "@/Utils/constants";
import roleChecker from "@/app/middleware/roleChecker";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeFeedback } from "@/lib/feedback";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type ParamsType = {
  id: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await db.users.findUnique({ where: { cuid: userId } });
    const { id } = params;
    const projectsId = req.nextUrl.searchParams.get("projectsId");

    if (!id) {
      throw new ApiError(400, "Missing id");
    }

    if (!projectsId) {
      throw new ApiError(400, "Missing projects id");
    }

    const project = await db.projects.findUnique({
      where: {
        cuid: projectsId!,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const projectId = project?.id;

    await roleChecker(user?.id!, projectId!);

    const feedbackPost = await db.feedbackPosts.findFirst({
      where: { cuid: id, deletedAt: null },
      include: FeedbackPostIncludeDBQuery,
    });

    if (!feedbackPost) {
      throw new ApiError(404, "Feedback post not found");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        computeFeedback(privacyResponse(feedbackPost), user?.id),
        "Feedback fetched successfully"
      )
    );
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const { id } = params;

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await db.users.findUnique({ where: { cuid: userId } });
    const projectsId = req.nextUrl.searchParams.get("projectsId");

    if (!id) {
      throw new ApiError(400, "Missing id");
    }

    if (!projectsId) {
      throw new ApiError(400, "Missing projects id");
    }
    const project = await db.projects.findUnique({
      where: {
        cuid: projectsId!,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const projectId = project?.id;

    await roleChecker(user?.id!, projectId!);

    const feedbackPost = await db.feedbackPosts.findFirst({
      where: { cuid: id, deletedAt: null },
    });
    if (!feedbackPost) {
      throw new ApiError(404, "Feedback post not found");
    }

    const deleteFeedbackPost = await db.feedbackPosts.update({
      where: { cuid: id },
      data: {
        deletedAt: new Date(),
      },
      include: FeedbackPostIncludeDBQuery,
    });

    if (!deleteFeedbackPost) {
      throw new ApiError(500, "Something went wrong while delete feedback");
    }

    return NextResponse.json(
      new ApiResponse(200, privacyResponse(deleteFeedbackPost), "Feedback deleted successfully")
    );
  });
}

export async function PUT(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await db.users.findUnique({ where: { cuid: userId } });
    const body = await req.json();

    if (
      !body.title ||
      !body.description ||
      !body.status ||
      !body.feedbackBoardsId
    ) {
      throw new ApiError(400, "Missing fields");
    }

    const project = await db.projects.findUnique({
      where: {
        cuid: body.projectsId,
        feedbackBoards: {
          some: {
            cuid: body.feedbackBoardsId,
          },
        },
      },
    });

    if (!project) {
      throw new ApiError(404, "Either project or feedback board not exist");
    }

    await roleChecker(user?.id!, project?.id!);

    const feedbackPost = await db.feedbackPosts.findUnique({
      where: {
        cuid: body.id,
      },
    });

    if (!feedbackPost) {
      throw new ApiError(404, "Feedback not found");
    }

    const feedbackBoard = await db.feedbackBoards.findUnique({
      where: {
        cuid: body.feedbackBoardsId,
      },
      select: {
        id: true,
      },
    });

    if (!feedbackBoard) {
      throw new ApiError(404, "Feedback board not found");
    }

    const releaseTags = await db.releaseTags.findMany({
      where: {
        organizationsId: project?.organizationsId!, // TODO: Check this.
        code: {
          in: body.releaseTags,
        },
      },
    });

    if (
      !isValidArray(
        body.releaseTags,
        releaseTags.map((tag) => tag.code)
      )
    ) {
      throw new ApiError(400, "Release tag is invalid");
    }

    const updateFeedbackPost = await db.feedbackPosts.update({
      where: {
        cuid: body.id,
      },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        feedbackBoardsId: feedbackBoard?.id,
        updatedAt: new Date(),
        releaseETA: body.releaseETA ? new Date(body.releaseETA) : null,
        visibilityStatus: body.visibilityStatus,
        releaseTags: {
          deleteMany: { feedbackPostId: feedbackPost?.id },
          create: releaseTags.map((tag) => ({ releaseTagId: tag.id })),
        },
      },
      include: FeedbackPostIncludeDBQuery,
    });

    if (!updateFeedbackPost) {
      throw new ApiError(500, "Something went wrong while creating feedback");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        computeFeedback(privacyResponse(updateFeedbackPost), user?.id),
        "Feedback updated successfully"
      )
    );
  });
}

export async function PATCH(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await db.users.findUnique({ where: { cuid: userId } });
    const body = await req.json();

    if (!body.status || !body.projectsId || !body.id) {
      throw new ApiError(400, "Missing fields");
    }

    const feedbackPost = await db.feedbackPosts.findUnique({
      where: {
        cuid: body.id,
      },
    });

    if (!feedbackPost) {
      throw new ApiError(404, "Feedback not found");
    }

    const project = await db.projects.findUnique({
      where: {
        cuid: body.projectsId,
        feedbackBoards: {
          some: {
            id: feedbackPost?.feedbackBoardsId!,
          },
        },
      },
    });

    if (!project) {
      throw new ApiError(404, "Either project or feedback board not exist");
    }

    await roleChecker(user?.id!, project?.id!);

    const updateFeedbackPost = await db.feedbackPosts.update({
      where: {
        cuid: body.id,
      },
      data: {
        status: body.status,
        updatedAt: new Date(),
      },
      include: FeedbackPostIncludeDBQuery,
    });

    if (!updateFeedbackPost) {
      throw new ApiError(500, "Something went wrong while creating feedback");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        computeFeedback(privacyResponse(updateFeedbackPost), user?.id),
        "Feedback updated successfully"
      )
    );
  });
}
