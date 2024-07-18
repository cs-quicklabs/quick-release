import { privacyResponse } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
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

    const projectUser = await db.projectsUsers.findFirst({
      where: {
        usersId: user?.id,
        isActive: true,
      },
    });
    if (projectUser === null) {
      throw new ApiError(404, "Active project not found");
    }

    const project = await db.projects.findUnique({
      where: {
        id: projectUser?.projectsId,
      },
    });

    return NextResponse.json(
      new ApiResponse(200, privacyResponse(project), "Active project fetched successfully")
    );
  });
}
