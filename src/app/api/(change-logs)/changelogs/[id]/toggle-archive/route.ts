import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { SelectUserDetailsFromDB } from "@/Utils/constants";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type ParamsType = {
  id: string;
};

export async function POST(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const { id } = params;

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const changeLog = await db.log.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!changeLog) {
      throw new ApiError(404, "Change log not found");
    }

    if (changeLog.createdById !== userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const updatedChangeLog = await db.log.update({
      where: { id },
      data: {
        archivedAt: changeLog.archivedAt ? null : new Date(),
      },
      include: {
        project: { select: { id: true, name: true } },
        createdBy: { select: SelectUserDetailsFromDB },
        updatedBy: { select: SelectUserDetailsFromDB },
      },
    });

    if (
      !updatedChangeLog ||
      changeLog.archivedAt === updatedChangeLog.archivedAt
    ) {
      throw new ApiError(500, "Something went wrong while updating change log");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        updatedChangeLog,
        `${
          updatedChangeLog.archivedAt ? "Archive" : "Unarchive"
        } change log successfully`
      )
    );
  });
}
