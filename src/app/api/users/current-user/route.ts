import { privacyResponse, privacyResponseArray } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/Utils/emailHandler";

export async function GET(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    const userId = session?.user?.id;
    const user = await db.users.findUnique({
      where: {
        cuid: userId,
      },
    });
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const loggedInUser = privacyResponse(
      await db.users.findFirst({
        where: {
          id: user?.id,
        },
        select: {
          id: true,
          cuid: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          email: true,
          isActive: true,
          isVerified: true,
        },
      })
    );

    const orgs = await db.organizationsUsers.findMany({
      where: {
        usersId: user?.id,
      },
      select: {
        organizations: {
          select: {
            id: true,
            cuid: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      new ApiResponse(
        200,
        {
          ...loggedInUser,
          orgs: orgs.map((org) => {
            return {
              id: org.organizations.cuid,
              name: org.organizations.name,
            };
          }),
        },
        "Current user fetched successfully"
      )
    );
  });
}

export async function PATCH(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    const userId = session?.user?.id;
    const user = await db.users.findUnique({
      where: {
        cuid: userId,
      },
    });
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const body = await req.json();

    if (
      !body.email &&
      !body.firstName &&
      !body.lastName &&
      !body.profilePicture
    ) {
      throw new ApiError(400, "Missing fields");
    }

    const existingUserEmail = await db.users.findFirst({
      where: {
        email: body.email,
      },
    });

    if (existingUserEmail && existingUserEmail?.id !== user?.id) {
      throw new ApiError(400, "Email already exists");
    }

    if (body.email !== user?.email) {
      const verificationToken = crypto.randomBytes(20).toString("hex");
      const registerVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

      const verificationTokenExpires = (Date.now() + 3600000).toString();
      await db.users.update({
        where: {
          id: user?.id,
        },
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          profilePicture: body.profilePicture,
          isVerified: false,
          verificationToken: registerVerificationToken,
          verificationTokenExpiry: verificationTokenExpires,
        },
      });

      sendVerificationEmail(
        body.email,
        registerVerificationToken,
        body.firstName || user?.firstName
      );

      NextResponse.json(
        new ApiResponse(200, null, "Verification email sent successfully")
      );
    }

    const updatedUser = await db.users.update({
      where: {
        id: user?.id,
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        profilePicture: body.profilePicture,
      },
    });

    if (!updatedUser) {
      throw new ApiError(500, "Something went wrong while updating user");
    }

    return NextResponse.json(
      new ApiResponse(
        200,
        privacyResponse(updatedUser),
        "Profile updated successfully"
      )
    );
  });
}
