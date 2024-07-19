import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  return asyncHandler(async () => {
    const body = await request.json();
    if (body.token) {
      const user = await db.users.findUnique({
        where: {
          verificationToken: body.token,
        },
      });

      if (!user) {
        throw new ApiError(400, "Invalid Token");
      }

      if(user.isVerified){
        throw new ApiError(400, "Account already verified");
      }

      if (user.verificationTokenExpiry) {
        let tokenExpiryTimestamp = parseInt(user.verificationTokenExpiry);
        if (tokenExpiryTimestamp < Date.now())
          throw new ApiError(400, "Verification link has expired");
      }

      await db.users.update({
        where: {
          id: user?.id,
        },
        data: {
          isVerified: true,
        },
      });
      return NextResponse.json(
        new ApiResponse(200, null, "Your account has been verified"),
      )
    }
    else{
      throw new ApiError(400, "Token not found");
    }
  })
};