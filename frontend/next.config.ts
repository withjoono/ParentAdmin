import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    transpilePackages: ['geobuk-shared'],
};

export default nextConfig;

