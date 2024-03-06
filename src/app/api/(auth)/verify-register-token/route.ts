import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log(body);
    if (body.id) {
      const user = await db.user.findUnique({
        where: {
          verificationToken: body.id,
        },
      });

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
  } catch (err) {
    console.log(err, "err");
    return new NextResponse("Invalid Token", { status: 400 });
  }
};
