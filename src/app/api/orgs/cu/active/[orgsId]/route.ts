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
    const user = await db.users.findUnique({ where: { cuid: userId } });
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const organization = await db.organizations.findUnique({
      where: {
        cuid: orgsId,
      },
    });

    const orgsAccessByUser = await db.organizationsUsers.findUnique({
      // @ts-ignore
      where: {
        organizationsId: organization?.id,
        usersId: user?.id,
      },
    });

    if (!orgsAccessByUser) {
      throw new ApiError(401, "Unauthorized request");
    }

    const orgIds = await db.organizationsUsers.findMany({
      where: {
        usersId: user?.id,
      },
      select: {
        organizationsId: true,
      },
    });

    const orgs = orgIds.map((org) => org.organizationsId);

    await db.organizationsUsers.updateMany({
      where: {
        organizationsId: {
          in: orgs,
        },
      },
      data: {
        isActive: false,
      },
    });

    await db.organizationsUsers.update({
      // @ts-ignore
      where: {
        organizationsId: organization?.id,
        usersId: user?.id,
      },
      data: {
        isActive: true,
      },
    });

    return NextResponse.json(
      new ApiResponse(
        200,
        null,
        "Current organizations activated successfully"
      )
    );
  });
}
