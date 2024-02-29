import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { password, email } = await request.json();

  const hashedPassword = await hash(password, 10);

  try {
    await db.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    return new NextResponse("User's password is updated", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, { status: 500 });
  }
};
