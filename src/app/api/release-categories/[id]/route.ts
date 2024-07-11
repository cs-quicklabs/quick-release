import { getReleaseKeyCode } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type ParamsType = {
  id: string;
};

export async function PUT(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const id: number = parseInt(params.id);

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const body = await req.json();
    const name: string = body.name?.trim();
    if (!name) {
      throw new ApiError(400, "Category name is required");
    }

    if(!body.organisationId) {
      throw new ApiError(400, "Organisation Id is required");
    }
    const categoryCode = getReleaseKeyCode(name);
    const releaseCategory = await db.releaseCategory.findFirst({
      where: {
        NOT: { id },
        code: categoryCode,
        organisationId: body.organisationId,
      },
    });
    if (releaseCategory) {
      throw new ApiError(409, "Category name already exists");
    }

    const updatedReleaseCategory = await db.releaseCategory.update({
      where: { id, organisationId: body.organisationId },
      data: {
        name: body.name,
        code: categoryCode,
        textColor: body.textColor,
        bgColor: body.bgColor,
      },
    });

    if (!updatedReleaseCategory) {
      throw new ApiError(
        500,
        "Something went wrong while updating release category"
      );
    }

    return NextResponse.json(
      new ApiResponse(200, updatedReleaseCategory, "Update release category successfully")
    );
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const id: number = parseInt(params.id);

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const organisationId = req.nextUrl.searchParams.get("organisationId");

    if (!organisationId) {
      throw new ApiError(400, "Organisation id is required");
    }

    const releaseCategory = await db.releaseCategory.findFirst({
      where: {
        id,
        organisationId: organisationId,
      },
    });
    if (!releaseCategory) {
      throw new ApiError(404, "Release category not found");
    }

    await db.releaseCategoryOnLogs.deleteMany({
      where: { releaseCategoryId: id },
    });

    const deletedReleaseCategory = await db.releaseCategory.delete({
      where: { id },
    });

    if(!deletedReleaseCategory) {
      throw new ApiError(500, "Something went wrong while deleting release category");
    }

    return NextResponse.json(
      new ApiResponse(200, null, "Delete release category successfully")
    );
  });
}
