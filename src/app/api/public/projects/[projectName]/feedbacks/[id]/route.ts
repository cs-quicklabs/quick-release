import { privacyResponse, privacyResponseArray } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { FeedbackPostIncludeDBQuery } from "@/Utils/constants";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { computeFeedback } from "@/lib/feedback";

type ParamsType = {
  projectName: string;
  id: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    let { projectName, id } = params;
    projectName = projectName.toLowerCase();

    const projectQuery = { slug: projectName };
    const project = await db.projects.findFirst({
      where: projectQuery,
      include: { Users: true },
    });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const feedbackPost = privacyResponse(
      await db.feedbackPosts.findUnique({
        where: { cuid: id, deletedAt: null, visibilityStatus: "public" },
        include: FeedbackPostIncludeDBQuery,
      })
    );

    return NextResponse.json(
      new ApiResponse(
        200,
        computeFeedback(feedbackPost),
        "Feedback Posts fetched successfully"
      )
    );
  });
}
