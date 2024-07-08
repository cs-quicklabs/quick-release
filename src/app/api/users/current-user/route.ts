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

    const loggedInUser = await db.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        email: true,
        role: true,
        isActive: true,
        isVerified: true,
      },
    });

    const orgs = await db.organisationUsers.findMany({
      where: {
        userId: userId,
      },
      select: {
        organisation: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          ...loggedInUser,
          orgs: orgs.map((org) => org.organisation),
        },
        "Current user fetched successfully"
      )
    );
  });
}
