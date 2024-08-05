import { ApiError } from "@/Utils/ApiError";
import { ApiResponse } from "@/Utils/ApiResponse";
import { asyncHandler } from "@/Utils/asyncHandler";
import { deleteFileFromS3, uploadFileToS3 } from "@/Utils/s3";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const allowedModals = ["ChangeLogs", "ProfilePictures"];
const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function POST(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const formData = await req.formData();
    const file = formData.get("file") as Blob;
    const onModal = formData.get("onModal");

    if (!file) {
      throw new ApiError(400, "File is required");
    }

    if (!file?.type || !file?.size) {
      throw new ApiError(400, "Invalid file data");
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new ApiError(
        400,
        `File size should not exceed ${MAX_FILE_SIZE_MB} MB`
      );
    }

    if (typeof onModal !== "string" || !allowedModals.includes(onModal)) {
      throw new ApiError(400, `Invalid modal name: ${onModal}`);
    }

    const uploadedFileDetails = await uploadFileToS3(file, onModal);
    return NextResponse.json(
      new ApiResponse(201, uploadedFileDetails, "File uploaded successfully")
    );
  });
}

export async function DELETE(req: NextRequest) {
  return asyncHandler(async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const body = await req.json();
    const filePathUrls = body.filePathUrls;
    const onModal = body.onModal;

    for(const filePathUrl of filePathUrls) {
      if(!filePathUrl) {
        throw new ApiError(400, "File path url is required");
      }
      const res = await deleteFileFromS3(filePathUrl, onModal);
      if (!res) {
        throw new ApiError(400, "File not found");
      }
    }

    return NextResponse.json(
      new ApiResponse(201, null, "File deleted successfully")
    );
  });
}
