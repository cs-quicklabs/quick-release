import { privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { FeedbackPostIncludeDBQuery } from "@/Utils/constants";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeFeedback } from "@/lib/feedback";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
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
    const body = await req.json();
    const { projectsId } = body;

    if (!projectsId) {
      throw new ApiError(400, "Missing fields");
    }

    const project = await db.projects.findUnique({
      where: {
        cuid: projectsId!,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const feedbackPost = await db.feedbackPosts.findUnique({
      where: {
        cuid: id!,
      },
      select: {
        id: true,
      },
    });

    if (!feedbackPost) {
      throw new ApiError(404, "Feedback post not found");
    }

    const upvotedUser = await db.feedbackPostVotes.findFirst({
      where: {
        feedbackPostId: feedbackPost?.id!,
        userId: user?.id!,
      },
    });

    if (upvotedUser) {
      const deleted = await db.feedbackPostVotes.delete({
        where: {
          feedbackPostId_userId: {
            feedbackPostId: feedbackPost?.id!,
            userId: user?.id!,
          },
        },
      });

      if (!deleted) {
        throw new ApiError(500, "Failed to upvote");
      }
    } else {
      const created = await db.feedbackPostVotes.create({
        data: {
          feedbackPostId: feedbackPost?.id!,
          userId: user?.id!,
        },
      });

      if (!created) {
        throw new ApiError(500, "Failed to upvote");
      }
    }

    const updatedFeedbackPost = await db.feedbackPosts.findUnique({
      where: {
        id: feedbackPost?.id!,
      },
      include: FeedbackPostIncludeDBQuery,
    });

    return NextResponse.json(
      new ApiResponse(
        200,
        computeFeedback(privacyResponse(updatedFeedbackPost), user?.id),
        "upvoted successfully"
      )
    );
  });
}
