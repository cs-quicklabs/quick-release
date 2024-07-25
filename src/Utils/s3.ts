import { ApiError } from "./ApiError";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY_ID!,
  },
  endpoint: process.env.NODE_ENV === "production" || process.env.VERCEL_GIT_COMMIT_REF === "main"
    ? `https://${process.env.NEXT_PUBLIC_AWS_S3_REGION}.digitaloceanspaces.com`
    : undefined,
});

const buildFilePublishUrl = (path: string) => {
  const region = process.env.NEXT_PUBLIC_AWS_S3_REGION;
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

  return  process.env.NODE_ENV === "production" || process.env.VERCEL_GIT_COMMIT_REF === "main"
    ? `https://${bucketName}.${region}.digitaloceanspaces.com/${path}`
    : `https://s3.${region}.amazonaws.com/${bucketName}/${path}`;
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

    const uploadCommand = process.env.VERCEL_GIT_COMMIT_REF === "main"
      ? new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: fileBuffer,
          ContentType: fileType,
          ACL: "public-read",
        })
      : new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: fileBuffer,
          ContentType: fileType,
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
