import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const body = await request.json();
  if (body.id) {
    const user = await db.user.findUnique({
      where: {
        verificationToken: body.id,
      },
    });
    let verificationTokenExpiry;

    if (user) {
      verificationTokenExpiry = parseInt(
        user.verificationTokenExpiry as string,
        10
      );
    }
    const updatedUser = await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        isVerified: true,
      },
    });
    if (!user) {
      return new NextResponse("Invalid Token", { status: 400 });
    }
    return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
  }
};
