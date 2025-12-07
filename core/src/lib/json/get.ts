import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const command = 'yt-dlp -j --no-warnings'

export default async function (url: string): Promise<any | null> {
  try {
    const { stdout } = await execAsync(`${command} ${url}`, { maxBuffer: 1024 * 1024 * 1024 })
    return JSON.parse(stdout)
  } catch {
    return null
  }
}
