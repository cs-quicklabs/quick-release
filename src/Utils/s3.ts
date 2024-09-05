import { ApiError } from "./ApiError";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY_ID!,
  },
  endpoint: `https://${process.env.NEXT_PUBLIC_AWS_S3_REGION}.digitaloceanspaces.com`,
});

const buildFilePublishUrl = (path: string) => {
  const region = process.env.NEXT_PUBLIC_AWS_S3_REGION;
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
  return `https://${bucketName}.${region}.digitaloceanspaces.com/${path}`;
};

export const uploadFileToS3 = async (file: any, onModal: string) => {
  try {
    const fileType = file.type;
    const extension = fileType.toLowerCase().split("/").pop();

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const fileKey = `${onModal}/${fileName}`;

    const fileBlob = new Blob([file]);
    const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());

    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: fileType,
      ACL: "public-read",
    });
    const result = await s3Client.send(uploadCommand);
    return {
      name: fileName,
      path: fileKey,
      url: buildFilePublishUrl(fileKey),
      type: fileType,
      size: file.size,
    };
  } catch (error) {
    console.log("uploadFileToS3 error:", error);
    throw new ApiError(500, "Something went wrong while uploading file");
  }
};

export const deleteFileFromS3 = async (fileUrl: string, onModal: string) => {
  try {
    const path = `${onModal}/${fileUrl.split("/").pop()}`;
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: path,
    });
    const result = await s3Client.send(deleteCommand);
    return result;
  } catch (error) {
    console.log("deleteFileFromS3 error:", error);
    throw new ApiError(500, "Something went wrong while deleting file");
  }
};
