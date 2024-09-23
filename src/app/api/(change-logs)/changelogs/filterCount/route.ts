import roleChecker from "@/app/middleware/roleChecker";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
    const query: { [key: string]: any } = { deletedAt: null, archivedAt: null };

    const projectId = searchParams.get("projectsId");
    if(!projectId) {
      throw new ApiError(400, "projectId is required");
    }

    if (projectId) {
      const project = await db.projects.findUnique({
        where: {
          cuid: projectId,
        },
      });
      if (!project) {
        throw new ApiError(404, "Project not found");
      }
      await roleChecker(user?.id!, project?.id!);
      query.projectsId = project.id;
    }

    const feedbackCountByStatus = await db.changelogs.groupBy({
      by: ["status"],
      where: query,
      _count: { status: true },
    });

    const filterCountByStatusMap = feedbackCountByStatus.reduce(
      (acc: any, status: any) => {
        acc[status.status] = status._count.status;
        return acc;
      },
      {}
    );

    query.archivedAt = { not: null };

    filterCountByStatusMap["archived"] = await db.changelogs.count({
      where: query,
    });

    return NextResponse.json(
      new ApiResponse(
        200,
        filterCountByStatusMap,
        "Filter Count fetched successfully"
      )
    );
  });
}
