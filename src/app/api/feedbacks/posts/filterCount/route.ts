import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import roleChecker from "@/app/middleware/roleChecker";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await db.users.findUnique({ where: { cuid: userId } });

    const { searchParams } = req.nextUrl;
    const query: { [key: string]: any } = { deletedAt: null };

    const projectId = searchParams.get("projectsId");
    if (!projectId) {
      throw new ApiError(400, "Missing project Id");
    }

    const project = await db.projects.findUnique({
      where: { cuid: projectId },
    });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }
    
    await roleChecker(user?.id!, project?.id!);

    // Modify query to include feedback boards
    if (project?.id) {
      query.feedbackBoards = {
        projects: { id: project.id },
      };
    }

    // Get feedback boards and map them by their IDs
    const feedbackBoards = await db.feedbackBoards.findMany({
      where: {
        projectsId: project?.id,
      },
      select: { id: true, name: true },
    });

    const feedbackBoardMap = feedbackBoards.reduce((acc: any, board: any) => {
      acc[board.id] = board.name;
      return acc;
    }, {});

    // Get feedback counts by status
    const feedbackCountByStatus = await db.feedbackPosts.groupBy({
      by: ['status'],
      where: query,
      _count: { status: true },
    });

    const feedbackStatusCountMap: { [key: string]: number } = {};
    feedbackCountByStatus.forEach((statusCount: any) => {
      feedbackStatusCountMap[statusCount.status] = statusCount._count.status;
    });

    // Get feedback counts by board
    const feedbackCountByBoard = await db.feedbackPosts.groupBy({
      by: ['feedbackBoardsId'],
      where: query,
      _count: { feedbackBoardsId: true },
    });

    const feedbackBoardCountMap: { [key: string]: number } = {};
    feedbackCountByBoard.forEach((boardCount: any) => {
      const boardName = feedbackBoardMap[boardCount.feedbackBoardsId];
      feedbackBoardCountMap[boardName] = boardCount._count.feedbackBoardsId;
    });

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          feedbackStatusCountMap,
          feedbackBoardCountMap,
        },
        "Filter Count fetched successfully"
      )
    );
  });
}
