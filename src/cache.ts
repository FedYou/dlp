import fs from 'fs'
import youfile from 'youfile'
import cache from 'global/cache'
import getSize from 'utils/getSize'
import type { CacheStats } from 'types/any'

function fastFileType(filePath: string): 'unknown' | 'audio' | 'image' | 'video' | 'text' {
  const fd = fs.openSync(filePath, 'r')
  const buffer = Buffer.alloc(16)
  fs.readSync(fd, buffer, 0, 16, 0)
  fs.closeSync(fd)

  const hex = buffer.toString('hex')
  const ascii = buffer.toString('ascii')

  if (hex.startsWith('ffd8ff')) return 'image'
  if (hex.startsWith('89504e47')) return 'image'
  if (hex.startsWith('52494646') && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image'

  if (buffer.toString('ascii', 0, 3) === 'ID3') return 'audio'
  if (hex.startsWith('fff3') || hex.startsWith('fff2')) return 'audio'
  if (hex.startsWith('1f8b')) return 'audio'
  if (ascii.startsWith('OpusHead')) return 'audio'

  if (ascii.slice(4, 8) === 'ftyp') return 'video'

  if (hex.startsWith('1a45dfa3')) return 'video'

  if (hex.startsWith('000001ba')) return 'video'

  if (buffer.every((b) => b === 9 || b === 10 || b === 13 || (b >= 32 && b <= 126))) return 'text'

  return 'unknown'
}

function getStats(): CacheStats {
  const files = youfile.SearchSync.files(cache.path, { recursive: true })
  const sizes = {
    unknown: 0,
    audio: 0,
    image: 0,
    video: 0,
    text: 0
  }

  for (const file of files) {
    const stat = fs.statSync(file)
    sizes[fastFileType(file)] += stat.size
  }

  return {
    unknown: getSize(sizes.unknown) as string,
    audio: getSize(sizes.audio) as string,
    image: getSize(sizes.image) as string,
    video: getSize(sizes.video) as string,
    text: getSize(sizes.text) as string,
    total: getSize(sizes.unknown + sizes.audio + sizes.image + sizes.video + sizes.text) as string
  }
}

function clear() {
  youfile.removeSync(cache.path, { exists: true })
  youfile.WriteSync.dir(cache.path)
}

export default {
  getStats,
  clear,
  path: cache.path
}
