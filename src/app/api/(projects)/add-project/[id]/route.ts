import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const existingProject = await db.project.findFirst({
      where: { name: body.projects, adminId: params.id },
    });
    if (existingProject) {
      throw new Error("Project with this name already exists");
    }
    const project = await db.project.create({
      data: {
        name: body.projects,
        adminId: params.id,
      },
    });
    return NextResponse.json({
      status: 201,
      message: "Created Successfully",
      project,
    });
  } catch (e: any) {
    console.log(e, "error");
    return NextResponse.json(
      {
        message: e.message,
      },
      { status: 400 }
    );
  }
}
