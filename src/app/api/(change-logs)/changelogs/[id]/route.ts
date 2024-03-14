import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { SelectUserDetailsFromDB } from "@/Utils/constants";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

type ParamsType = {
  id: string;
};

export async function GET(req: Request, { params }: { params: ParamsType }) {
  return asyncHandler(async () => {
    const { id } = params;

    const changeLog = await db.log.findFirst({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        createdBy: { select: SelectUserDetailsFromDB },
        updatedBy: { select: SelectUserDetailsFromDB },
      },
    });

    if (!changeLog) {
      throw new ApiError(404, "Change log not found");
    }

    return NextResponse.json(
      new ApiResponse(200, changeLog, "Changelog fetched successfully")
    );
  });
}
