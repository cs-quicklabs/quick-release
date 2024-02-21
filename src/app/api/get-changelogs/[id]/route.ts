import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request, { params }: any) {
  try {
    const changeLogs = await db.log.findMany({
      where: {
        projectId: params.id,
      },
    });
    return NextResponse.json(changeLogs);
  } catch (err) {
    console.log(err, "err");
  }
}
