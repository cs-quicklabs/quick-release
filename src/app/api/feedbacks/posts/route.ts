import { isValidArray, privacyResponse, privacyResponseArray } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { FeedbackPostIncludeDBQuery } from "@/Utils/constants";
import roleChecker from "@/app/middleware/roleChecker";
import { authOptions } from "@/lib/auth";
import { computeFeedback } from "@/lib/feedback";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    const newFeedbackPost = await db.feedbackPosts.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        feedbackBoardsId: feedbackBoard?.id,
        createdById: user?.id!,
      },
    });

    if (!newFeedbackPost) {
      throw new ApiError(500, "Something went wrong while creating feedback");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        computeFeedback(privacyResponse(newFeedbackPost), user?.id),
        "Feedback created successfully"
      )
    );
  });
}

export async function GET(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await db.users.findUnique({ where: { cuid: userId } });

    const { searchParams } = req.nextUrl;
    const query: { [key: string]: any } = { deletedAt: null };

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const start = (page - 1) * limit;

    const projectId = searchParams.get("projectsId");
    if (!projectId) {
      throw new ApiError(400, "Missing project Id");
    }

    const project = await db.projects.findUnique({
      where: {
        cuid: projectId,
      },
    });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }
    await roleChecker(user?.id!, project?.id!);
    if (project?.id) {
      query.feedbackBoards = {
        projects: {
          id: project.id,
        },
      };
    }

    const boardIds = searchParams.get("feedbackBoards")?.split(",");

    if (boardIds) {
      const feedbackBoards = await db.feedbackBoards.findMany({
        where: {
          cuid: {
            in: boardIds,
          },
        },
        select: {
          id: true,
        },
      });
      query.feedbackBoardsId = {
        in: feedbackBoards.map((board) => board.id),
      };
    }

    const search = searchParams.get("search");
    // case insensitive
    if (search) {
      query.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const status = searchParams.get("feedbackStatus")?.split(",");

    if (status) {
      query.status = {
        in: status,
      };
    }
    console.log(query);

    const feedbackPosts = privacyResponseArray(
      await db.feedbackPosts.findMany({
        where: query,
        include: FeedbackPostIncludeDBQuery,
        skip: start,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      })
    );

    const totalFeedbackPosts = await db.feedbackPosts.count({ where: query });
    const hasNextPage = totalFeedbackPosts > page * limit;
    const nextPage = hasNextPage ? page + 1 : null;

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          feedbackPosts: feedbackPosts.map((feedback: any) =>
            computeFeedback(feedback, user?.id)
          ),
          page,
          limit,
          total: totalFeedbackPosts,
          hasNextPage,
          nextPage,
        },
        "All Feedbacks fetched successfully"
      )
    );
  });
}
