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
  const ytdlp = toFormatDependency(await getVersion('yt-dlp'))

  ytdlp.lastest = await isLastVersionYTDLP(ytdlp.version)

  const ffmpeg = toFormatDependency(await getVersion('ffmpeg'))
  const deno = toFormatDependency(await getVersion('deno'))
  const aria2 = toFormatDependency(await getVersion('aria2'))

  return {
    'all-installed': ytdlp.installed && ffmpeg.installed && deno.installed && aria2.installed,
    list: {
      ytdlp,
      ffmpeg: ffmpeg,
      deno: deno,
      aria2: aria2
    }
  }
}

export default { status }
