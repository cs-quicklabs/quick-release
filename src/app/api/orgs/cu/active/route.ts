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
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const orgs = await db.organisationUsers.findMany({
      where: {
        userId: userId,
      },
      select: {
        organisationId: true,
      },
    });

    if (!orgs) {
      throw new ApiError(401, "Unauthorized request");
    }

    const orgIds = orgs.map((org) => org.organisationId);

    const activeOrg = await db.organisation.findFirst({
      where: {
        id: {
          in: orgIds,
        },
        isActive: true,
      },
    });

    if (!activeOrg) {
      throw new ApiError(404, "Active organisation not found");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        activeOrg,
        "Active organisation fetched successfully"
      )
    );
  });
}
