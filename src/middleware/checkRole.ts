// middleware/checkRole.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const checkRole = (allowedRoles: string[], userId: string) => {
  // @ts-ignore
  return async (req, res, next) => {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    const projectUser = await db.projectUsers.findMany({
      where: {
        userId,
      },
    });

    const hasRole = projectUser.some((user) => allowedRoles.includes(user.role));

    if (hasRole) {
      next();
    } else {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  };
};
