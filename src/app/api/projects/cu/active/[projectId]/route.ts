import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
    { params: { projectId } }: { params: { projectId: string } }
) {
    return asyncHandler(async () => {
      const session = await getServerSession(authOptions);
  
      // @ts-ignore
      const userId = session?.user?.id;
      if (!userId) {
        throw new ApiError(401, "Unauthorized request");
      }
  
      if(!projectId) {
        throw new ApiError(400, "Project Id is required");  
      }

      const project = await db.project.findFirst({
        where: {
          id: projectId,
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
          createdById: userId,
        },
      });
      const activeProject = await db.project.update({
        data: {
          isActive: true,
        },
        where: {
          id: projectId,
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