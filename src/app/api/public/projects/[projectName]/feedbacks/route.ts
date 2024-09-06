import { privacyResponseArray } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { FeedbackPostIncludeDBQuery } from "@/Utils/constants";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { computeFeedback } from "@/lib/feedback";

type ParamsType = {
  projectName: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    let { projectName } = params;
    projectName = projectName.toLowerCase();

    const projectQuery = { name: projectName };
    const project = await db.projects.findFirst({
      where: projectQuery,
      include: { Users: true },
    });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const start = (page - 1) * limit;

    const getAllPublishedFeedbackPostsQuery: { [key: string]: any } = {
      feedbackBoards: {
        projectsId: project.id,
      },
      deletedAt: null,
      visibilityStatus: "public",
    };

    const board = searchParams.get("board") || undefined;
    const status = searchParams.get("feedbackStatus") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort = searchParams.get("sort") || undefined;
    if (board) {
      const feedbackBoardId = await db.feedbackBoards.findFirst({
        where: { name: board, projectsId: project.id! },
        select: { id: true },
      })

      getAllPublishedFeedbackPostsQuery.feedbackBoardsId = feedbackBoardId?.id
    }

    if (status) {
      getAllPublishedFeedbackPostsQuery.status = status
    }

    if(search) {
      getAllPublishedFeedbackPostsQuery.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          }
        }
      ]
    }

    const feedbackPosts = privacyResponseArray(
      await db.feedbackPosts.findMany({
        where: getAllPublishedFeedbackPostsQuery,
        include: FeedbackPostIncludeDBQuery,
        skip: start,
        take: limit,
        orderBy: { 
          createdAt: sort === "desc" ? "desc" : "asc"
        }
      })
    );

    const totalFeedbackPosts = await db.feedbackPosts.count({
      where: getAllPublishedFeedbackPostsQuery,
    });
    const hasNextPage = totalFeedbackPosts > page * limit;
    const nextPage = hasNextPage ? page + 1 : null;

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          feedbackPosts: feedbackPosts.map((feedbackPost: any) =>
            computeFeedback(feedbackPost)
          ),
          page,
          limit,
          total: totalFeedbackPosts,
          hasNextPage,
          nextPage,
        },
        "Feedback Posts fetched successfully"
      )
    );
  });
}
