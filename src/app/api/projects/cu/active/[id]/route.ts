import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRole } from "@/middleware/checkRole";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  res: Response,
  { params }: { params: { id: string } }
) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    const userId = session?.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const roleMiddleware = checkRole(
      [Role.SUPER_ADMIN, Role.ADMIN, Role.MEMBER],
      userId
    );
    await roleMiddleware(req, res, () => {});

    if (!params.id) {
      throw new ApiError(400, "Project Id is required");
    }

    const project = await db.project.findFirst({
      where: {
        id: params.id,
      },
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    await db.project.updateMany({
      data: {
        isActive: false,
      },
      where: {
        adminId: userId,
      },
    });
    const activeProject = await db.project.update({
      data: {
        isActive: true,
      },
      where: {
        id: params.id,
      },
    });

    if (!activeProject) {
      throw new ApiError(400, "Failed to activate project");
    }

    return NextResponse.json(
      new ApiResponse(200, "Project activated successfully")
    );
  });
}
