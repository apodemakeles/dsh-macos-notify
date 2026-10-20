/**
 * Two builds, one package:
 * - lib/index.js  host ESM; registers the `turn-notify` session projection.
 * - lib/client.js browser CJS bundle wrapped in the DSH ModuleLoader factory
 *   handshake, served at /plugins/dsh-macos-notify/client.js.
 *
 * The host bundles zod (the projection schema). React stays external in the
 * client and resolves from the shell's module table.
 */
import { build } from 'esbuild'
import { mkdirSync } from 'node:fs'

mkdirSync('lib', { recursive: true })

const dshExternal = ['@deepseek-ai/*']
const clientExternal = [
  ...dshExternal,
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'scheduler',
]

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: ['node22'],
  sourcemap: true,
  external: dshExternal,
  logLevel: 'info',
})

await build({
  entryPoints: ['src/client/index.ts'],
  outfile: 'lib/client.js',
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: ['es2022'],
  sourcemap: true,
  jsx: 'automatic',
  external: clientExternal,
  banner: {
    js: "window.__ModuleLoader__.load({ id: '@apodemakeles/dsh-macos-notify', factory: (require) => { var module = { exports: {} }; var exports = module.exports;",
  },
  footer: {
    js: 'return module.exports; } });',
  },
  logLevel: 'info',
})
