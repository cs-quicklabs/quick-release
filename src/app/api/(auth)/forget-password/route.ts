import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { sendResetPasswordEmail } from "@/Utils/emailHandler";
import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return asyncHandler(async () => {
    const body = await request.json();
    if (!body?.email) throw new ApiError(400, "Missing email");
    const existingUser = await db.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!existingUser) {
      throw new ApiError(400, "Email doesn't exists");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; //24hours
    const passwordResetExpires = (Date.now() + oneDayInMilliseconds).toString();

    existingUser.resetToken = passwordResetToken;
    existingUser.resetTokenExpiry = passwordResetExpires;

    const update = await db.user.update({
      where: {
        email: body.email,
      },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: passwordResetExpires,
      },
    });

    if (!update) {
      throw new ApiError(400, "Unable to send reset link, Try again later");
    }

    await sendResetPasswordEmail(
      existingUser.email,
      resetToken,
      existingUser.firstName
    );

    return NextResponse.json(
      new ApiResponse(200, null, "Reset Password email is sent")
    );
  });
}
