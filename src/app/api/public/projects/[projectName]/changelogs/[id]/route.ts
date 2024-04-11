import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import {
  ChangeLogIncludeDBQuery,
  SelectUserDetailsFromDB,
} from "@/Utils/constants";
import { computeChangeLog } from "@/lib/changeLog";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type ParamsType = {
  projectName: string;
  id: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const { projectName, id } = params;

    const projectQuery = { name: projectName };
    const project = await db.project.findFirst({ where: projectQuery });
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    const changeLogQuery = {
      id,
      projectId: project.id,
      deletedAt: null,
      status: "published",
    };
    const changeLog = await db.log.findFirst({
      where: changeLogQuery,
      include: ChangeLogIncludeDBQuery,
    });
    if (!changeLog) {
      throw new ApiError(404, "Changelog not found");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        computeChangeLog(changeLog),
        "Changelog fetched successfully"
      )
    );
  });
}
