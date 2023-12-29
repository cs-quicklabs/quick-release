import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const post = await db.logs.create({
            data: {
                title: body.title,
                description: body.description,
                releaseVersion: body.releaseVersion,
                releaseCategory: body.releaseCategory
            }
        });
        return NextResponse.json(post, {status: 200})
    }catch(error){
        console.log(error);
        return NextResponse.json({message: "Error received"}, {status: 500})
    }
}   