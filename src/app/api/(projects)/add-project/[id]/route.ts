import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const existingProject = await db.project.findFirst({
      where: { name: body.projects },
    });
    if (existingProject) {
      throw new Error("Project name is already taken");
    }
    const checkProjects = await db.project.findMany({
      where: {
        adminId: params.id,
      },
    });
    const project = await db.project.create({
      data: {
        name: body.projects,
        adminId: params.id,
        isActive: checkProjects.length === 0 ? true : false,
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
