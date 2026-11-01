#!/usr/bin/env node
/**
 * Production build with a safety net for constrained hosts (Hostinger, cPanel).
 *
 * Turbopack (Next's default) runs PostCSS in a spawned worker process; on some
 * shared hosts that worker can't start and the build dies with
 * "node process exited before we could connect to it". When that happens we
 * rebuild with the webpack bundler, which runs everything in-process.
 *
 *   npm run build            → turbopack, falls back to webpack automatically
 *   NEXT_BUNDLER=webpack npm run build → webpack directly
 */
import { spawnSync } from 'node:child_process'

const run = (args) => {
  console.log(`\n▶ next ${args.join(' ')}\n`)
  const r = spawnSync(process.execPath, [new URL('../node_modules/next/dist/bin/next', import.meta.url).pathname, ...args], {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS ?? '--max-old-space-size=2048' },
  })
  return r.status ?? 1
}

if (process.env.NEXT_BUNDLER === 'webpack') {
  process.exit(run(['build', '--webpack']))
}

let code = run(['build'])
if (code !== 0) {
  console.warn('\n⚠ Turbopack build failed on this host — retrying with the webpack bundler…\n')
  code = run(['build', '--webpack'])
}
process.exit(code)
