import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { sendPasswordUpdatedEmail } from "@/Utils/emailHandler";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { compare, hash } from "bcrypt";
import { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "@/Utils/ApiError";
import { NextResponse } from "next/server";
import { privacyResponse } from "@/Utils";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    const userId = session?.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }
    const body = await request.json();
    if(!body?.password || !body?.oldPassword){
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await db.users.findUnique({
      where: { cuid: params.id },
    });
    if (!existingUser) {
      throw new ApiError(404, "User not found");
    }
    const newHashedPassword = await hash(body.password, 10);
    const passwordCorrect = await compare(
      body?.oldPassword,
      existingUser?.password
    );

    if (!passwordCorrect) {
      throw new ApiError(400, "Old Password is incorrect");
    }
    const passwordSame = await compare(body?.password, existingUser?.password);

    if (passwordSame) {
      throw new ApiError(400, "New Password cannot be same as old password");
    }

    const update = await db.users.update({
      data: {
        password: newHashedPassword,
      },
      where: {
        id: existingUser?.id,
      },
    });

    if(!update) {
      throw new ApiError(500, "Unable to update password");
    }

    await sendPasswordUpdatedEmail(existingUser.email, existingUser.firstName);
    
    return NextResponse.json(
      new ApiResponse(200, privacyResponse(update), "Password has been updated successfully")
    );
  })
}
