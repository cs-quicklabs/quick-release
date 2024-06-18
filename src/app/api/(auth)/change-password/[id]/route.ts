import { sendPasswordUpatedEmail } from "@/Utils/emailHandler";
import { db } from "@/lib/db";
import { compare, hash } from "bcrypt";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const existingUser = await db.user.findUnique({
      where: { id: params.id },
    });
    if (!existingUser) {
      throw new Error("User Not Found!");
    }
    const newHashedPassword = await hash(body.password, 10);
    if (existingUser) {
      const passwordCorrect = await compare(
        body?.oldPassword,
        existingUser?.password
      );

      if (!passwordCorrect) {
        throw new Error("Incorrect Password!");
      }
    }
    const passwordSame = await compare(body?.password, existingUser?.password);

    if (passwordSame) {
      throw new Error("New Password cannot be same as Old Password");
    }

    const update = await db.user.update({
      data: {
        password: newHashedPassword,
      },
      where: {
        id: existingUser.id,
      },
    });

    await sendPasswordUpatedEmail(existingUser.email, existingUser.firstName);
    
    return NextResponse.json({
      status: 200,
      message: "Password has been updated successfully",
      update,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
      },
      { status: 400 }
    );
  }
}
