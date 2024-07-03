import { getReleaseTagCode } from "@/Utils";
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
      throw new ApiError(400, "Tag name is required");
    }
    const tagCode = getReleaseTagCode(name);
    const releaseTag = await db.releaseTag.findFirst({
      where: {
        NOT: { id },
        code: tagCode,
        organisationId: user?.organisationId,
      },
    });
    if (releaseTag) {
      throw new ApiError(409, "Tag name already exists");
    }

    const updatedReleaseTag = await db.releaseTag.update({
      where: { id, organisationId: user?.organisationId },
      data: {
        name: body.name,
        code: tagCode,
      },
    });

    if (!updatedReleaseTag) {
      throw new ApiError(
        500,
        "Something went wrong while updating release tag"
      );
    }

    return NextResponse.json(
      new ApiResponse(200, updatedReleaseTag, "Update release tag successfully")
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

    const releaseTag = await db.releaseTag.findFirst({
      where: {
        id,
        organisationId: user.organisationId,
      },
    });
    if (!releaseTag) {
      throw new ApiError(404, "Release tag not found");
    }

    await db.releaseTagOnLogs.deleteMany({
      where: { releaseTagId: id },
    });

    const deletedReleaseTag = await db.releaseTag.delete({
      where: { id },
    });

    return NextResponse.json(
      new ApiResponse(200, null, "Delete release tag successfully")
    );
  });
}
