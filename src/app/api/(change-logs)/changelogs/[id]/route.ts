import { isValidArray, privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { ChangeLogIncludeDBQuery } from "@/Utils/constants";
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
    const { id } = params;

    const changeLog = await db.changelogs.findFirst({
      where: { cuid: id, deletedAt: null },
      include: ChangeLogIncludeDBQuery,
    });

    if (!changeLog) {
      throw new ApiError(404, "Change log not found");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        computeChangeLog(privacyResponse(changeLog)),
        "Changelog fetched successfully"
      )
    );
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const { id } = params;

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    const user = await db.users.findUnique({ where: { cuid: userId } });
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const changeLog = await db.changelogs.findFirst({
      where: {
        cuid: id,
        deletedAt: null,
      },
    });
    if (!changeLog) {
      throw new ApiError(404, "Change log not found");
    }

    const deleteChangeLog = await db.changelogs.update({
      where: { cuid: id },
      data: {
        updatedById: user?.id,
        deletedAt: new Date(),
      },
    });

    if (!deleteChangeLog.deletedAt) {
      throw new ApiError(500, "Something went wrong while delete change log");
    }

    return NextResponse.json(
      new ApiResponse(200, null, "Change log deleted successfully")
    );
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const { id } = params;
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

    const releaseTags = await db.releaseTags.findMany({
      where: {
        organizationsId: project?.organizationsId!, // TODO: Check this.
        code: {
          in: body.releaseTags,
        },
      },
    });

    const releaseCategories = await db.releaseCategories.findMany({
      where: {
        organizationsId: project?.organizationsId!, // TODO: Check this.
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

    const changeLog = await db.changelogs.findFirst({
      where: {
        cuid: id,
        deletedAt: null,
      },
    });

    if (!changeLog) {
      throw new ApiError(404, "Change log not found");
    }



    const updatedChangeLog = await db.changelogs.update({
      where: {cuid: id},
      data: {
        title: body.title,
        description: body.description,
        releaseVersion: body.releaseVersion,
        releaseCategories: {
          deleteMany: { logId: changeLog?.id },
          create: releaseCategories.map((category) => ({ releaseCategoryId: category.id })),
        },
        // releaseTags: body.releaseTags,
        releaseTags: {
          deleteMany: { logId: changeLog?.id },
          create: releaseTags.map((tag) => ({ releaseTagId: tag.id })),
        },
        updatedById: user?.id,
        status: body.status,
        scheduledTime: body.scheduledTime ?? null,
        archivedAt: null,
      },
      include: ChangeLogIncludeDBQuery,
    });

    if (!updatedChangeLog) {
      throw new ApiError(500, "Something went wrong while updating change log");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        computeChangeLog(privacyResponse(updatedChangeLog)),
        "Change log updated successfully"
      )
    );
  });
}
