import { privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { ChangeLogIncludeDBQuery } from "@/Utils/constants";
import { authOptions } from "@/lib/auth";
import { computeChangeLog } from "@/lib/changeLog";
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

    const updatedChangeLog = await db.changelogs.update({
      where: { cuid: id },
      data: {
        archivedAt: changeLog.archivedAt ? null : new Date(),
      },
      include: ChangeLogIncludeDBQuery,
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
        computeChangeLog(privacyResponse(updatedChangeLog)),
        `${
          updatedChangeLog.archivedAt ? "Archive" : "Unarchive"
        } change log successfully`
      )
    );
  });
}
