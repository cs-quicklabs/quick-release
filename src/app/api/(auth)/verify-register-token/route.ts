import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  return asyncHandler(async () => {
    const body = await request.json();
    if (body.token) {
      const user = await db.user.findUnique({
        where: {
          verificationToken: body.token,
        },
      });

      if (!user) {
        throw new ApiError(400, "Link is expired");
      }

      if(user.isVerified){
        throw new ApiError(400, "Account already verified");
      }

      await db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          isVerified: true,
        },
      });
      if (user.verificationTokenExpiry) {
        let tokenExpiryTimestamp = parseInt(user.verificationTokenExpiry);
        if (tokenExpiryTimestamp < Date.now())
          throw new ApiError(400, "Verification link has expired");
      }
      return NextResponse.json(
        new ApiResponse(200, null, "Your account has been verified"),
      )
    }
    else{
      throw new ApiError(400, "Link is invalid");
    }
  })
};