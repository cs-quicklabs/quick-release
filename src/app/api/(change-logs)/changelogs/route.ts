import { isValidArray } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { ChangeLogIncludeDBQuery } from "@/Utils/constants";
import { authOptions } from "@/lib/auth";
import { computeChangeLog } from "@/lib/changeLog";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const body = await req.json();

    if (!body.title || !body.description || !body.releaseVersion) {
      throw new ApiError(400, "Missing title, description or release version");
    }

    const releaseTags = await db.releaseTag.findMany({
      where: {
        organisationId: user.organisationId,
        code: {
          in: body.releaseTags,
        },
      },
    });

    if (!isValidArray(body.releaseCategories, ["new", "improvement", "bug_fix", "refactor", "maintenance"])) {
      throw new ApiError(400, "Release category is invalid");
    }

    if (!isValidArray(body.releaseTags, releaseTags.map((tag) => tag.code))) {
      throw new ApiError(400, "Release tag is invalid");
    }

    const newChangeLog = await db.log.create({
      data: {
        title: body.title,
        description: body.description,
        releaseVersion: body.releaseVersion,
        releaseCategories: body.releaseCategories,
        projectId: body.projectId,
        // releaseTags: body.releaseTags,
        releaseTags: {
          create: releaseTags.map((tag) => ({ releaseTagId: tag.id })),
        },
        createdById: userId,
        updatedById: userId,
        status: body.status,
        scheduledTime: body.scheduledTime ?? null,
      },
      include: ChangeLogIncludeDBQuery,
    });

    if (!newChangeLog) {
      throw new ApiError(500, "Something went wrong while creating change log");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        computeChangeLog(newChangeLog),
        "Create changelog successfully"
      )
    );
  });
}

export async function GET(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;

    if(!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
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
      include: ChangeLogIncludeDBQuery,
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
