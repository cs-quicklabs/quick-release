import { ApiError } from "./ApiError";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY_ID!,
  },
});

const buildFilePublishUrl = (path: string) => {
  const region = process.env.NEXT_PUBLIC_AWS_S3_REGION;
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;

  return `https://s3.${region}.amazonaws.com/${bucketName}/${path}`;
};

export const uploadFileToS3 = async (file: any, onModal: string) => {
  try {
    const fileType = file.type;
    const extension = fileType.toLowerCase().split("/").pop();

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const fileKey = `${onModal}/${fileName}`;

    const fileBlob = new Blob([file]);
    const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: fileType,
    });
    await s3Client.send(uploadCommand);

    return {
      name: fileName,
      path: fileKey,
      url: buildFilePublishUrl(fileKey),
      type: fileType,
      size: file.size,
    };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while uploading file");
  }
};
