import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { SelectUserDetailsFromDB } from "@/Utils/constants";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    const body = await req.json();

    const newChangeLog = await db.log.create({
      data: {
        title: body.title,
        description: body.description,
        releaseVersion: body.releaseVersion,
        releaseCategories: body.releaseCategories,
        projectId: body.projectId,
        releaseTags: body.releaseTags,
        createdById: userId,
        updatedById: userId,
        status: body.status,
        scheduledTime: body.scheduledTime ?? null,
      },
      include: {
        project: { select: { id: true, name: true } },
        createdBy: { select: SelectUserDetailsFromDB },
        updatedBy: { select: SelectUserDetailsFromDB },
      },
    });

    if (!newChangeLog) {
      throw new ApiError(500, "Something went wrong while creating change log");
    }

    return NextResponse.json(
      new ApiResponse(200, newChangeLog, "Create changelog successfully")
    );
  });
}

export async function GET(req: NextRequest) {
  return asyncHandler(async () => {
    const { searchParams } = req.nextUrl;
    const query: { [key: string]: any } = { deletedAt: null };

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const start = (page - 1) * limit;

    const projectId = searchParams.get("projectId");
    if (projectId) {
      query.projectId = projectId;
    }

    const status = searchParams.get("status");
    if (status) {
      query.status = status;
      query.archivedAt = null;
    }

    const isArchived = searchParams.get("isArchived");
    if (isArchived) {
      query.archivedAt = { not: null };
    }

    const changeLogs = await db.log.findMany({
      where: query,
      include: {
        project: { select: { id: true, name: true } },
        createdBy: { select: SelectUserDetailsFromDB },
        updatedBy: { select: SelectUserDetailsFromDB },
      },
      skip: start,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalChangeLogs = await db.log.count({ where: query });
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
