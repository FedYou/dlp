import { build, buildSync } from 'esbuild'
import { execSync } from 'child_process'
import fs from 'fs'

import PACKAGE from '../package.json'

const REQUIRE = 'import{createRequire}from"module";var require=createRequire(import.meta.url);'

if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true })
}

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
fs.copyFileSync('LICENSE', 'dist/LICENSE')

const URL_IMAGES = {
  screenshot1: 'https://raw.githubusercontent.com/FedYou/dlp/refs/heads/main/images/screenshot-1.png',
  screenshot2: 'https://raw.githubusercontent.com/FedYou/dlp/refs/heads/main/images/screenshot-2.png'
}

let readmeContent = fs.readFileSync('README.md').toString()

readmeContent = readmeContent
  .replace('./images/screenshot-1.png', URL_IMAGES.screenshot1)
  .replace('./images/screenshot-2.png', URL_IMAGES.screenshot2)

fs.writeFileSync('dist/README.md', readmeContent)
