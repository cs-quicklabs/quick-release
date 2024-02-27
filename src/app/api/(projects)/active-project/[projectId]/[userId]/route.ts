import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { userId: string; projectId: string } }
) {
  await db.project.updateMany({
    data: {
      isActive: false,
    },
    where: {
      adminId: params.userId,
    },
  });
  const activeProject = await db.project.update({
    data: {
      isActive: true,
    },
    where: {
      id: params.projectId,
    },
  });
  return NextResponse.json(activeProject);
}
