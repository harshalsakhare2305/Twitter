import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images:{
    domains:["icons.veryicon.com"]
  }
};

export default nextConfig;
