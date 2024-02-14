import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("userid", params.id);
    const projects = await db.project.findMany({
      where: {
        adminId: params?.id,
      },
    });
    // const projectId = projects[0].id;
    // const activateProject = await db.project.update({
    //   where: {
    //     id: projectId,
    //   },
    //   data: {
    //     isActive: true,
    //   },
    // });
    // const inactiveAllprojects = await db.project.updateMany({
    //   where: {
    //     adminId: params.id,
    //   },
    //   data: {
    //     isActive: false,
    //   },
    // });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json("Failed to fetch projects");
  }
}
