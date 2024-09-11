/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [`${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.digitaloceanspaces.com`],
    }
}

module.exports = nextConfig
