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
      throw new ApiError(400, "Category name is required");
    }

    if (name.length > 30) {
      throw new ApiError(400, "Category name must be less than 30 characters");
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
        code: categoryCode,
        organizationsId: orgs?.id,
      },
    });
    if (releaseCategory) {
      throw new ApiError(409, "Category name already exists");
    }

    const newReleaseCategory = await db.releaseCategories.create({
      data: {
        name: body.name,
        code: categoryCode,
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

    if (!newReleaseCategory) {
      throw new ApiError(
        500,
        "Something went wrong while creating release category"
      );
    }

    return NextResponse.json(
      new ApiResponse(200, privacyResponse(newReleaseCategory), "Create release Category successfully")
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

    const releaseCategories = privacyResponseArray(
      await db.releaseCategories.findMany({
        where: {
          organizationsId: org?.id,
        },
        select: {
          id: true,
          cuid: true,
          name: true,
          code: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    )

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
