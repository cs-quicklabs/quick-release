import { privacyResponseArray } from "@/Utils";
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

    const projectQuery = { slug: projectName };
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

    const getAllPublishedChangeLogsQuery: { [key: string]: any } = {
      projectsId: project.id,
      deletedAt: null,
      archivedAt: null,
      status: "published",
    };

    const releaseCategories = searchParams.get("releaseCategories")?.split(",");
    if (releaseCategories?.length) {
      const selectedReleaseCategories = await db.releaseCategories.findMany({
        where: {
          code: {
            in: releaseCategories,
          },
          organizationsId: project?.organizationsId!,
        },
      });
      getAllPublishedChangeLogsQuery.releaseCategories = {
        some: {
          releaseCategoryId: {
            in: selectedReleaseCategories.map((category) => category.id),
          },
        },
      };
    }

    const releaseTags = searchParams.get("releaseTags")?.split(",");
    if (releaseTags?.length) {
      const selectedReleaseTags = await db.releaseTags.findMany({
        where: {
          code: {
            in: releaseTags,
          },
          organizationsId: project?.organizationsId!,
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

    const changeLogs = privacyResponseArray(
      await db.changelogs.findMany({
        where: getAllPublishedChangeLogsQuery,
        include: ChangeLogIncludeDBQuery,
        skip: start,
        take: limit,
        orderBy: {
          scheduledTime: "desc",
        },
      })
    );

    const totalChangeLogs = await db.changelogs.count({
      where: getAllPublishedChangeLogsQuery,
    });
    const hasNextPage = totalChangeLogs > page * limit;
    const nextPage = hasNextPage ? page + 1 : null;

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          changeLogs: changeLogs.map((changeLog: any) =>
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
