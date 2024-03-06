import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { SelectUserDetailsFromDB } from "@/Utils/constants";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Response) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
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
        schemaTime: body.schemaTime ?? null,
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
