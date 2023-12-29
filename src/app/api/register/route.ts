import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";
import { NextApiResponse } from "next";
export async function POST(request: Request, res: NextApiResponse) {
  try {
    const body = await request.json();
    const hashedPassword = await hash(body.password, 10);
    const existingEmail = await db.user.findUnique({
      where: { email: body.email },
    });
    const existingOrgName = await db.user.findUnique({
      where: { orgName: body.orgName },
    });
    if (existingEmail) {
      return NextResponse.json({
        status: 400,
        message: "Email already exists",
      });
    }
    if (existingOrgName) {
      return NextResponse.json(
        {
          status: 400,
          message: "Organisation already exists",
        },
        { status: 400 }
      );
    }
    const register = await db.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        orgName: body.orgName,
      },
    });
    return NextResponse.json({
      status: 200,
      message: "Registered Successfully",
      register,
    });
  } catch (e) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
