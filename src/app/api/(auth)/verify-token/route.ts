import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    if (body.id) {
      const user = await db.user.findUnique({
        where: {
          resetToken: body.id,
        },
      });

      if (!user) {
        return new NextResponse("Invalid Token", { status: 400 });
      }
      if (user.resetTokenExpiry) {
        let tokenExpiryTimestamp = parseInt(user.resetTokenExpiry);
        if (tokenExpiryTimestamp < Date.now())
          return new NextResponse("Reset Link has expired", { status: 400 });
      }
      return NextResponse.json(user, { status: 200 });
    }
  } catch (err) {
    console.log(err, "err");
    return new NextResponse("Invalid Token", { status: 400 });
  }
};
