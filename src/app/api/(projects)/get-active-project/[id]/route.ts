import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request,{ params }: { params: { id: string }} ) {
  console.log(params.id,"params")
  try {
    const activeProject = await db.project.findFirst({
      where: {
        isActive: true,
        adminId: params.id
      },
    });
    return NextResponse.json(activeProject);
  } catch (err) {
    console.log(err, "err");
    return NextResponse.json(err);
  }
}
