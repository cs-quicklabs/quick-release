import { privacyResponse, privacyResponseArray } from "@/Utils";
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
    const user = await db.users.findUnique({
      where: {
        cuid: userId,
      },
    })
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const loggedInUser = privacyResponse(
      await db.users.findFirst({
        where: {
          id: user?.id,
        },
        select: {
          id: true,
          cuid: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          email: true,
          isActive: true,
          isVerified: true,
        },
      })
    );

    const orgs = await db.organizationsUsers.findMany({
        where: {
          usersId: user?.id,
        },
        select: {
          organizations: {
            select: {
              id: true,
              cuid: true,
              name: true,
            },
          },
        },
      });
    
    const activeProjectId = await db.projectsUsers.findFirst({
      where: {
        usersId: user?.id,
        isActive: true
      },
      select: {
        projects: {
          select: {
            cuid: true
          }
        }
      }
    })

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          ...loggedInUser,
          orgs: orgs.map((org) => {
            return {
              id: org.organizations.cuid,
              name: org.organizations.name,
            }
          }),
          activeProjectId: activeProjectId?.projects.cuid
        },
        "Current user fetched successfully"
      )
    );
  });
}
