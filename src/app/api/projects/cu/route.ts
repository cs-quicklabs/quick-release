import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const query: { [key: string]: any } = { adminId: userId };

    const projects = await db.project.findMany({ where: query });
    const totalProjects = await db.project.count({ where: query });

    return NextResponse.json(
      new ApiResponse(
        200,
        { projects, totalProjects },
        "Projects fetched successfully"
      )
    );
  });
}
