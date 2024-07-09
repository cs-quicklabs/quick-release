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
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const project = await db.project.findFirst({
      where: {
        createdById: userId,
        isActive: true,
      },
    });
    if (project === null) {
      throw new ApiError(404, "Active project not found");
    }

    return NextResponse.json(
      new ApiResponse(200, project, "Active  project fetched successfully")
    );
  });
}
