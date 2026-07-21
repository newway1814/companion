import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  // Pin the workspace root so Next does not infer it from stray lockfiles
  // elsewhere on the machine.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
