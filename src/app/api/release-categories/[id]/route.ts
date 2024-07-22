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
      throw new ApiError(400, "Category name is required");
    }

    if(!body.organizationsId) {
      throw new ApiError(400, "organizations Id is required");
    }

    const orgs = await db.organizations.findUnique({
      where: {
        cuid: body?.organizationsId,
      }
    })
    const categoryCode = getReleaseKeyCode(name);
    const releaseCategory = await db.releaseCategories.findFirst({
      where: {
        NOT: { cuid },
        code: categoryCode,
        organizationsId: orgs?.id,
      },
    });
    if (releaseCategory) {
      throw new ApiError(409, "Category name already exists");
    }

    const updatedReleaseCategory = await db.releaseCategories.update({
      where: { cuid, organizationsId: orgs?.id },
      data: {
        name: body.name,
        code: categoryCode,
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

    if (!updatedReleaseCategory) {
      throw new ApiError(
        500,
        "Something went wrong while updating release category"
      );
    }

    return NextResponse.json(
      new ApiResponse(200, privacyResponse(updatedReleaseCategory), "Update release category successfully")
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

    const org = await db.organizations.findFirst({
      where: {
        cuid: organizationsId
      }
    });

    if (!org?.id) {
      throw new ApiError(404, "Organization not found");
    }

    const releaseCategory = await db.releaseCategories.findFirst({
      where: {
        cuid,
        organizationsId: org?.id,
      },
    });
    if (!releaseCategory) {
      throw new ApiError(404, "Release category not found");
    }

    await db.changelogReleaseCategories.deleteMany({
      where: { releaseCategoryId: releaseCategory?.id },
    });

    const deletedReleaseCategory = await db.releaseCategories.delete({
      where: { cuid },
    });

    if(!deletedReleaseCategory) {
      throw new ApiError(500, "Something went wrong while deleting release category");
    }

    return NextResponse.json(
      new ApiResponse(200, null, "Delete release category successfully")
    );
  });
}
