import { execSync } from 'child_process'

const COMMAND = 'bun build'

const ARGS = [
  '--compile',
  '--minify',
  '--external',
  'blessed',
  '--external',
  'clipboardy',
  'src/main.ts'
]

const TARGETS = ['linux-x64', 'linux-arm64', 'windows-x64', 'darwin-x64', 'darwin-arm64']

for (const target of TARGETS) {
  console.log(`Compiling for ${target}...`)

  const outFile = 'dist/' + 'dlp-' + target

  const args = [...ARGS, '--target', 'bun-' + target, '--outfile', outFile]

  execSync(`${COMMAND} ${args.join(' ')}`)
}
