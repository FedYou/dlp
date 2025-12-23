import dlf from 'lib/dlf'
import existsCache from 'utils/existsCache'
import generateCache from 'utils/generateCache'

// ----------------------------
// --- Types ------------------
// ----------------------------
import type { MediaDownloadOptions } from 'types/media'

// ----------------------------
// --- Functions --------------
// ----------------------------

export default async function ({ json, options, on }: MediaDownloadOptions) {
  const { NAMES } = generateCache(json, options)
  const { platform, formats } = json
  const _on = {
    progress: on?.progress as any,
    complete: () => {}
  }
  if (!existsCache(NAMES.thumbnail)) {
    on?.start('thumbnail')
    await dlf({ url: json.thumbnail, fileName: NAMES.thumbnail, on: _on })
    on?.complete('thumbnail', 0)
  } else {
    on?.complete('thumbnail', 0)
  }

  if (platform === 'tiktok') {
    const url = (formats as any)[options.vformat as 'mp4' | 'webm'][options.vquality ?? 0].url
    const fileName = NAMES.tiktok
    const cookies = json?.cookies
    const referer = json?.referer

    if (!existsCache(fileName)) {
      on?.start('video')
      await dlf({ url, referer, cookies, fileName: NAMES.tiktok, on: _on })
      on?.complete('video', 0)
    } else {
      on?.complete('video', 0)
    }
    return
  }

  if (options.type === 'onlyVideo' || options.type === 'video') {
    const url = (formats as any)[options.vformat as 'mp4' | 'webm'][options.vquality ?? 0].url
    const fileName = NAMES.onlyVideo

    if (!existsCache(fileName)) {
      on?.start('video')
      await dlf({ url, fileName: NAMES.onlyVideo, on: _on })
      on?.complete('video', 0)
    } else {
      on?.complete('video', 0)
    }
  }
  if (options.type === 'onlyAudio' || options.type === 'video') {
    if (!json.formats.audio) return

    let url: string = ''

    if (platform === 'youtube' && !(formats.audio as any)?.url) {
      url = (
        (formats as any).audio[options?.language as string] ??
        (formats as any).audio[json.language as string]
      ).url
    } else {
      url = (formats as any).audio.url
    }

    const fileName = NAMES.onlyAudio

    if (!existsCache(fileName)) {
      on?.start('audio')
      await dlf({ url, fileName: NAMES.onlyAudio, on: _on })
      on?.complete('audio', 0)
    } else {
      on?.complete('audio', 0)
    }
  }
}
