import { extractImageUrls, isValidArray, privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import {
  ChangeLogIncludeDBQuery,
  FeedbackPostIncludeDBQuery,
} from "@/Utils/constants";
import { deleteFileFromS3 } from "@/Utils/s3";
import roleChecker from "@/app/middleware/roleChecker";
import { authOptions } from "@/lib/auth";
import { computeChangeLog } from "@/lib/changeLog";
import { db } from "@/lib/db";
import moment from "moment";
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

    return NextResponse.json(
      new ApiResponse(
        200,
        computeChangeLog(privacyResponse(feedbackPost)),
        "Feedback post fetched successfully"
      )
    );
  });
}
