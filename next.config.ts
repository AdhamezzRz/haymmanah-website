import type { NextConfig } from 'next'

import path from 'node:path'

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile in a parent folder can't confuse the build.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
