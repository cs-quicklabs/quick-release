import { isValidArray, privacyResponseArray } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { ChangeLogIncludeDBQuery } from "@/Utils/constants";
import roleChecker from "@/app/middleware/roleChecker";
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
    const user = await db.users.findUnique({ where: { cuid: userId } });
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const body = await req.json();

    if (!body.title || !body.description || !body.releaseVersion) {
      throw new ApiError(400, "Missing title, description or release version");
    }

    const project = await db.projects.findUnique({
      where: {
        cuid: body.projectsId,
      },
    })

    await roleChecker(user?.id!, project?.id!);

    const orgs = await db.organizations.findUnique({
      where: {
        cuid: body?.organizationsId,
      }
    })

    const releaseTags = await db.releaseTags.findMany({
      where: {
        organizationsId: orgs?.id, // TODO: Check this.
        code: {
          in: body.releaseTags,
        },
      },
    });

    const releaseCategories = await db.releaseCategories.findMany({
      where: {
        organizationsId: orgs?.id, // TODO: Check this.
        code: {
          in: body.releaseCategories,
        },
      },
    }); 

    if (!isValidArray(body.releaseCategories, releaseCategories.map((category) => category.code))) {
      throw new ApiError(400, "Release category is invalid");
    }

    if (!isValidArray(body.releaseTags, releaseTags.map((tag) => tag.code))) {
      throw new ApiError(400, "Release tag is invalid");
    }

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const newChangeLog = await db.changelogs.create({
      data: {
        title: body.title,
        description: body.description,
        releaseVersion: body.releaseVersion,
        releaseCategories: {
          create: releaseCategories.map((category) => ({ releaseCategoryId: category.id })),
        },
        projectsId: project.id,
        // releaseTags: body.releaseTags,
        releaseTags: {
          create: releaseTags.map((tag) => ({ releaseTagId: tag.id })),
        },
        createdById: user?.id,
        updatedById: user?.id,
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
    const userId = session?.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const user = await db.users.findUnique({ where: { cuid: userId } });

    const { searchParams } = req.nextUrl;
    const query: { [key: string]: any } = { deletedAt: null };

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const start = (page - 1) * limit;

    const projectId = searchParams.get("projectId");
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
    

    const status = searchParams.get("status");
    if (status) {
      query.status = status;
      query.archivedAt = null;
    }

    const isArchived = searchParams.get("isArchived");
    if (isArchived) {
      query.archivedAt = { not: null };
    }

    const changeLogs = privacyResponseArray(
      await db.changelogs.findMany({
        where: query,
        include: ChangeLogIncludeDBQuery,
        skip: start,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      })
    );

    const totalChangeLogs = await db.changelogs.count({ where: query });
    const hasNextPage = totalChangeLogs > page * limit;
    const nextPage = hasNextPage ? page + 1 : null;

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          changeLogs: changeLogs.map((changeLog: any) => computeChangeLog(changeLog)),
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

