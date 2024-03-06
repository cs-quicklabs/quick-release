import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();

  const hashedToken = crypto
    .createHash("sha256")
    .update(body.token)
    .digest("hex");

  const user = await db.user.findUnique({
    where: {
      resetToken: hashedToken,
    },
  });

  if (user) {
    db.user.update({
      where: {
        resetToken: hashedToken,
      },
      data: {
        isVerified: true,
      },
    });
  }

  if (!user) {
    return new NextResponse("Invalid Token", { status: 400 });
  }
  return new NextResponse(JSON.stringify(user), { status: 200 });
};