import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projects = await db.project.findMany({
      where: {
        adminId: params?.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json("Failed to fetch projects");
  }
}
