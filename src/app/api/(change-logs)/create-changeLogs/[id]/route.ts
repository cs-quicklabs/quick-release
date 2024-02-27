import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: any) {
  try {
    const body = await req.json();
    const logs = await db.log.create({
      data: {
        title: body.title,
        description: body.description,
        releaseVersion: body.releaseVersion,
        releaseTags: body.releaseTags,
        projectId: params.id,
      },
    });
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
