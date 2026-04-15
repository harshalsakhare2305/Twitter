import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images:{
    domains:["icons.veryicon.com","lh3.googleusercontent.com"]
  }
};

export default nextConfig;
