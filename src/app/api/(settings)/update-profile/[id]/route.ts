import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  if (!params.id) {
    throw new Error("Invalid User");
  }
  try {
    const updatedUser = await db.user.update({
      where: {
        id: params.id,
      },
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        profilePicture: body.profilePicture,
      },
    });
    if (!updatedUser) {
      throw new Error("Update Failed");
    }
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
      },
      { status: 400 }
    );
  }
}
