import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest,
    { params: { orgsId } }: { params: { orgsId: string } }
) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    const userId = session?.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const orgsAccessByUser = await db.organisationUsers.findFirst({
      where: {
        organisationId: orgsId,
      },
    });

    if (!orgsAccessByUser) {
      throw new ApiError(401, "Unauthorized request");
    }

    const orgIds = await db.organisationUsers.findMany({
      where: {
        userId: userId,
      },
      select: {
        organisationId: true,
      },
    });

    const orgs = orgIds.map((org) => org.organisationId);

    await db.organisation.updateMany({
      where: {
        id: {
          in: orgs,
        },
      },
      data: {
        isActive: false,
      },
    });

    await db.organisation.update({
      where: {
        id: orgsId,
      },
      data: {
        isActive: true,
      },
    });

    return NextResponse.json(
      new ApiResponse(
        200,
        null,
        "Current organisation activated successfully"
      )
    );
  });
}
