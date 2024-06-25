import { selectedData } from "@/Utils";
import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  return asyncHandler(async () => {
    const { token } = await request.json();
    if (!token) {
      throw new ApiError(400, "Invalid Token");
    }

    const user = await db.user.findUnique({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      throw new ApiError(400, "Invalid Token");
    }

    if (user.resetTokenExpiry) {
      let tokenExpiryTimestamp = parseInt(user.resetTokenExpiry);
      if (tokenExpiryTimestamp < Date.now()) {
        throw new ApiError(400, "Reset Link has expired");
      }
    }
    return NextResponse.json(
      new ApiResponse(200, selectedData(user), "Your account has been verified")
    );
  });
};
