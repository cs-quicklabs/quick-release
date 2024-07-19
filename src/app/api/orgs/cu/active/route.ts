import { privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    const userId = session?.user?.id;
    const user = await db.users.findUnique({ where: { cuid: userId } });
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const orgs = await db.organizationsUsers.findMany({
      where: {
        usersId: user?.id,
      },
      select: {
        organizationsId: true,
      },
    });

    if (!orgs) {
      throw new ApiError(401, "Unauthorized request");
    }

    const orgIds = orgs.map((org) => org.organizationsId);

    const activeOrg = await db.organizationsUsers.findFirst({
      where: {
        organizationsId: {
          in: orgIds,
        },
        isActive: true,
      },
    });

    if (!activeOrg) {
      throw new ApiError(404, "Active organizations not found");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        privacyResponse(activeOrg),
        "Active organizations fetched successfully"
      )
    );
  });
}
