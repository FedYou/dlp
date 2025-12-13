import { build, buildSync } from 'esbuild'
import { execSync } from 'child_process'
import fs from 'fs'

import PACKAGE from '../package.json'

const REQUIRE = 'import{createRequire}from"module";var require=createRequire(import.meta.url);'

buildSync({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: true,
  outfile: 'dist/bin/dlp',
  platform: 'node',
  target: 'node20',
  format: 'esm',
  external: ['blessed', 'clipboardy'],
  banner: {
    js: `#!/usr/bin/env node\n;${REQUIRE}`
  }
})

execSync('chmod +x dist/bin/dlp')

const _package = PACKAGE

_package.workspaces = undefined as any
_package.devDependencies = undefined as any
_package.scripts = undefined as any
_package.dependencies['dlp-core'] = undefined as any

fs.writeFileSync('dist/package.json', JSON.stringify(_package, null, 2))
fs.copyFileSync('README.md', 'dist/README.md')
fs.cpSync('images', 'dist/images', { recursive: true })
fs.copyFileSync('LICENSE', 'dist/LICENSE')
