import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { ChangeLogIncludeDBQuery } from "@/Utils/constants";
import { computeChangeLog } from "@/lib/changeLog";
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
    const project = await db.project.findFirst({
      where: projectQuery,
      include: { User: true },
    });
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
      const selectedReleaseTags = await db.releaseTag.findMany({
        where: {
          code: {
            in: releaseTags,
          },
          organisationId: project.User?.organisationId,
        },
      });

      getAllPublishedChangeLogsQuery.releaseTags = {
        some: {
          releaseTagId: {
            in: selectedReleaseTags.map((tag) => tag.id),
          },
        },
      };
    }

    const releaseTagIds = [1];

    const changeLogs = await db.log.findMany({
      where: getAllPublishedChangeLogsQuery,

      include: ChangeLogIncludeDBQuery,
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
          changeLogs: changeLogs.map((changeLog) =>
            computeChangeLog(changeLog)
          ),
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
