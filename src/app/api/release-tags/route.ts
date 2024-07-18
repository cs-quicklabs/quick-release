import { getReleaseKeyCode, privacyResponse, privacyResponseArray } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return asyncHandler(async () => {
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
        code: tagCode,
        organizationsId: orgs?.id,
      },
    });
    if (releaseTag) {
      throw new ApiError(409, "Tag name already exists");
    }

    const newReleaseTag = await db.releaseTags.create({
      data: {
        name: body.name,
        code: tagCode,
        organizationsId: orgs?.id,
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

    if (!newReleaseTag) {
      throw new ApiError(
        500,
        "Something went wrong while creating release tag"
      );
    }

    return NextResponse.json(
      new ApiResponse(200, privacyResponse(newReleaseTag), "Create release tag successfully")
    );
  });
}

export async function GET(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    const user = await db.users.findUnique({ where: { cuid: userId } });
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const organizationsId = req.nextUrl.searchParams.get('organizationsId');
    if (!organizationsId) {
      throw new ApiError(400, "Organization id is required");
    }

    const orgId = await db.organizations.findFirst({
      where: {
        cuid: organizationsId
      }
    });

    if (!orgId) {
      throw new ApiError(404, "Organization not found");
    }

    const releaseTags = privacyResponseArray(
      await db.releaseTags.findMany({
        where: {
          organizationsId: orgId?.id,
        },
        select: {
          id: true,
          cuid: true,
          name: true,
          code: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          releaseTags,
          total: releaseTags.length,
        },
        "Release tags fetched successfully"
      )
    );
  });
}
