import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { SelectUserDetailsFromDB } from "@/Utils/constants";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
    const project = await db.project.findFirst({ where: projectQuery });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const start = (page - 1) * limit;

    const getAllPublishedChangeLogsQuery: { [key: string]: any } = {
      projectId: project.id,
      deletedAt: null,
      archivedAt: null,
      status: "published",
    };

    const releaseCategories = searchParams.get("releaseCategories")?.split(",");
    if (releaseCategories?.length) {
      getAllPublishedChangeLogsQuery.releaseCategories = {
        hasSome: releaseCategories,
      };
    }

    const releaseTags = searchParams.get("releaseTags")?.split(",");
    if (releaseTags?.length) {
      getAllPublishedChangeLogsQuery.releaseTags = {
        hasSome: releaseTags,
      };
    }

    const changeLogs = await db.log.findMany({
      where: getAllPublishedChangeLogsQuery,
      include: {
        project: { select: { id: true, name: true } },
        createdBy: { select: SelectUserDetailsFromDB },
        updatedBy: { select: SelectUserDetailsFromDB },
      },
      skip: start,
      take: limit,
      orderBy: {
        scheduledTime: "desc",
      },
    });

    const totalChangeLogs = await db.log.count({
      where: getAllPublishedChangeLogsQuery,
    });
    const hasNextPage = totalChangeLogs > page * limit;
    const nextPage = hasNextPage ? page + 1 : null;

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          changeLogs,
          page,
          limit,
          total: totalChangeLogs,
          hasNextPage,
          nextPage,
        },
        "Change logs fetched successfully"
      )
    );
  });
}
