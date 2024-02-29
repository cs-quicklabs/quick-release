import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
