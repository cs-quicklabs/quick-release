import { getReleaseTagCode } from "@/Utils";
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
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const body = await req.json();
    const name: string = body.name?.trim();
    if (!name) {
      throw new ApiError(400, "Tag name is required");
    }

    if(!body.organisationId) {
      throw new ApiError(400, "Organisation Id is required");
    }

    const tagCode = getReleaseTagCode(name);
    const releaseTag = await db.releaseTag.findFirst({
      where: {
        code: tagCode,
        organisationId: body.organisationId,
      },
    });
    if (releaseTag) {
      throw new ApiError(409, "Tag name already exists");
    }

    const newReleaseTag = await db.releaseTag.create({
      data: {
        name: body.name,
        code: tagCode,
        organisationId: body.organisationId,
      },
    });

    if (!newReleaseTag) {
      throw new ApiError(
        500,
        "Something went wrong while creating release tag"
      );
    }

    return NextResponse.json(
      new ApiResponse(200, newReleaseTag, "Create release tag successfully")
    );
  });
}

export async function GET(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id!;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError(401, "Unauthorized request");
    }

    const organisationId = req.nextUrl.searchParams.get('organisationId');
    if (!organisationId) {
      throw new ApiError(400, "Organisation id is required");
    }

    const releaseTags = await db.releaseTag.findMany({
      where: {
        organisationId: organisationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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
