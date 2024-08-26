import { getReleaseKeyCode, privacyResponse } from "@/Utils";
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
    const cuid = params.id;

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    const user = await db.users.findUnique({ where: { cuid: userId } });
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const body = await req.json();
    const name: string = body.name?.trim();
    if (!name) {
      throw new ApiError(400, "Tag name is required");
    }

    if (name.length > 30) {
      throw new ApiError(400, "Tag name must be less than 30 characters");
    }

    if(!body.organizationsId) {
      throw new ApiError(400, "organizations Id is required");
    }

    const orgs = await db.organizations.findUnique({
      where: {  
        cuid: body?.organizationsId,
      }
    })
    const tagCode = getReleaseKeyCode(name);
    const releaseTag = await db.releaseTags.findFirst({
      where: {
        NOT: { cuid },
        code: tagCode,
        organizationsId: orgs?.id,
      },
    });
    if (releaseTag) {
      throw new ApiError(409, "Tag name already exists");
    }

    const updatedReleaseTag = await db.releaseTags.update({
      where: { cuid, organizationsId: orgs?.id },
      data: {
        name: body.name,
        code: tagCode,
      },
      select: {
        id: true,
        cuid: true,
        name: true,
        code: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!updatedReleaseTag) {
      throw new ApiError(
        500,
        "Something went wrong while updating release tag"
      );
    }

    return NextResponse.json(
      new ApiResponse(200, privacyResponse(updatedReleaseTag), "Update release tag successfully")
    );
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  return asyncHandler(async () => {
    const cuid = params.id;

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    const user = await db.users.findUnique({ where: { cuid: userId } });
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const organizationsId = req.nextUrl.searchParams.get("organizationsId");

    if (!organizationsId) {
      throw new ApiError(400, "organizations id is required");
    }

    const orgs = await db.organizations.findFirst({
      where: {
        cuid: organizationsId,
      },
    });
    
    if (!orgs) {
      throw new ApiError(404, "Organization not found");
    }

    const releaseTag = await db.releaseTags.findFirst({
      where: {
        cuid,
        organizationsId: orgs?.id,
      },
    });
    if (!releaseTag) {
      throw new ApiError(404, "Release tag not found");
    }

    await db.changelogReleaseTags.deleteMany({
      where: { releaseTagId: releaseTag?.id },
    });

    const deletedReleaseTag = await db.releaseTags.delete({
      where: { cuid },
    });

    if (!deletedReleaseTag) {
      throw new ApiError(
        500,
        "Something went wrong while deleting release tag"
      );
    }

    return NextResponse.json(
      new ApiResponse(200, null, "Delete release tag successfully")
    );
  });
}
