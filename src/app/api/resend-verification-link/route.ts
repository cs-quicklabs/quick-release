import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { sendVerificationEmail } from "@/Utils/emailHandler";
import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return asyncHandler(async () => {
    const body = await request.json();
    if(!body.email) {
      throw new ApiError(400, "Email is required");
    }
    const user = await db.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new ApiError(400,"User is not registered");
    }
    
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const registerVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verificationTokenExpires = (Date.now() + 360000).toString();

    user.verificationToken = registerVerificationToken;
    user.verificationTokenExpiry = verificationTokenExpires;
    
    
    const userUpdated = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        verificationToken: verificationToken,
        verificationTokenExpiry: verificationTokenExpires,
      },
    });

    if(!userUpdated) {
      throw new ApiError(400, "Unable to send verification link");
    }
    await sendVerificationEmail(body.email, verificationToken, user.firstName);

    return NextResponse.json(
      new ApiResponse(200, null, "Verification link sent to your email"),
    );
  })
}