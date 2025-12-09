import { exec } from 'child_process'
import { promisify } from 'util'
import https from 'https'

// ----------------------------
// --- Types ------------------
// ----------------------------

import type { DependenciesStatus, DependencyStatusFormat } from 'types/any'

// ----------------------------
// --- Variables --------------
// ----------------------------

enum COMMANDS {
  YTDLP = 'yt-dlp --version',
  FFMPEG = 'ffmpeg -version',
  DENO = 'deno --version',
  ARIA2 = 'aria2c --version'
}

const execAsync = promisify(exec)

// ----------------------------
// --- Functions --------------
// ----------------------------

async function getStdout(command: string): Promise<string | null> {
  try {
    const { stdout } = await execAsync(command)
    return stdout
  } catch {
    return null
  }
}

async function getVersion(type: 'yt-dlp' | 'ffmpeg' | 'deno' | 'aria2'): Promise<string | null> {
  if (type === 'yt-dlp') {
    const stdout = await getStdout(COMMANDS.YTDLP)
    if (!stdout) return null
    return stdout.trim()
  }
  if (type === 'ffmpeg') {
    const stdout = await getStdout(COMMANDS.FFMPEG)
    if (!stdout) return null
    return stdout.slice(0, stdout.indexOf('Copyright')).split(' ')[2]
  }
  if (type === 'aria2') {
    const stdout = await getStdout(COMMANDS.ARIA2)
    if (!stdout) return null
    return stdout.slice(0, stdout.indexOf('\n')).split(' ')[2]
  }
  if (type === 'deno') {
    const stdout = await getStdout(COMMANDS.DENO)
    if (!stdout) return null
    return stdout.split(' ')[1]
  }
  return null
}

async function getVersionYTDLP(): Promise<string | null> {
  return new Promise((resolve, reject) => {
    https
      .get('https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest', (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => resolve(JSON.parse(data).tag_name))
      })
      .on('error', (err) => reject(err))
  })
}

async function isLastVersionYTDLP(version: string | null): Promise<boolean> {
  return (await getVersionYTDLP()) === version
}

function toFormatDependency(version: string | null): DependencyStatusFormat {
  return {
    installed: version !== null,
    version: version,
    lastest: null
  }
}

async function status(): Promise<DependenciesStatus> {
  const list = {
    ytdlp: {} as any,
    ffmpeg: null as any,
    deno: null as any,
    aria2: null as any
  }

  await Promise.all([
    getVersion('yt-dlp').then(async (version) => {
      list.ytdlp = { ...toFormatDependency(version), ...list.ytdlp }
      list.ytdlp.lastest = await isLastVersionYTDLP(version)
    }),
    isLastVersionYTDLP(list.ytdlp.version).then((lastest) => (list.ytdlp.lastest = lastest)),
    getVersion('ffmpeg').then((version) => (list.ffmpeg = toFormatDependency(version))),
    getVersion('deno').then((version) => (list.deno = toFormatDependency(version))),
    getVersion('aria2').then((version) => (list.aria2 = toFormatDependency(version)))
  ])

  return {
    'all-installed':
      list.ytdlp.installed && list.ffmpeg.installed && list.deno.installed && list.aria2.installed,
    list
  }
}

export default { status }
