import { IFile } from "@/types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import imageType from "image-type";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY_ID!,
  },
});

async function uploadFileToS3(file: any, fileName: string, folderName: string) {
  const fileBuffer = file;

  if (!folderName) {
    folderName = "files";
  }

  const imageMimeType = await imageType(fileBuffer);
  const contentType = imageMimeType
    ? imageMimeType.mime
    : "application/octet-stream";
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: `${folderName}/${Date.now()}-profile-picture.${
      imageMimeType ? imageMimeType.ext : "jpg"
    }`,
    Body: fileBuffer.buffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  const response = await s3Client.send(command);
  const publicUrl = `https://s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}/${params.Key}`;
  return publicUrl;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const fileBlob = new Blob([file]);

    const arrayBuffer = await fileBlob.arrayBuffer();

    const fileName = await uploadFileToS3(
      Buffer.from(arrayBuffer) as any,
      file.name,
      "ProfilePictures"
    );
    return NextResponse.json({
      success: "File uploaded successfully",
      fileName,
    });
  } catch (err) {
    console.log(err, "err");
    return NextResponse.json({ error: "Error uploading file" });
  }
}
