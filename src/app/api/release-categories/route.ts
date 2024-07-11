import { getReleaseKeyCode } from "@/Utils";
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
      throw new ApiError(400, "Category name is required");
    }

    if(!body.organisationId) {
      throw new ApiError(400, "Organisation Id is required");
    }

    const tagCode = getReleaseKeyCode(name);
    const releaseCategory = await db.releaseCategory.findFirst({
      where: {
        code: tagCode,
        organisationId: body.organisationId,
      },
    });
    if (releaseCategory) {
      throw new ApiError(409, "Category name already exists");
    }

    const newReleaseCategory = await db.releaseCategory.create({
      data: {
        name: body.name,
        code: tagCode,
        textColor: body.textColor,
        bgColor: body.bgColor,
        organisationId: body.organisationId,
      },
    });

    if (!newReleaseCategory) {
      throw new ApiError(
        500,
        "Something went wrong while creating release category"
      );
    }

    return NextResponse.json(
      new ApiResponse(200, newReleaseCategory, "Create release Category successfully")
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

    const releaseCategories = await db.releaseCategory.findMany({
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
          releaseCategories,
          total: releaseCategories.length,
        },
        "Release Categories fetched successfully"
      )
    );
  });
}
