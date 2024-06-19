import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  return asyncHandler(async () => {
    const { password, email, confirmPassword } = await request.json();
    if (!password || !email || !confirmPassword)
      throw new ApiError(400, "Missing email or password");

    if (password !== confirmPassword)
      throw new ApiError(400, "Passwords do not match");

    const hashedPassword = await hash(password, 10);
    const update = await db.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    if (!update) {
      throw new ApiError(400, "Unable to reset password, Try again later");
    }

    return NextResponse.json(
      new ApiResponse(200, null, "Password reset successfully")
    );
  });
};
