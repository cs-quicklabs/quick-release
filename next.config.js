/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [`s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com`, `quick-release.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.digitaloceanspaces.com`],
    }
}

module.exports = nextConfig
