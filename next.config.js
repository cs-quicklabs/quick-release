const withFlowbiteReact = require("flowbite-react/plugin/nextjs");
const nrExternals = require('newrelic/load-externals')


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.digitaloceanspaces.com`,
                port: '',
                pathname: '/**',
            },
        ]
    },
    serverExternalPackages: ['newrelic'],

}

module.exports = withFlowbiteReact(nextConfig)