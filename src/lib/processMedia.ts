import ffmpeg from 'lib/ffmpeg'
import existsCache from 'utils/existsCache'
import generateCache from 'utils/generateCache'

// ----------------------------
// --- Types ------------------
// ----------------------------

import type { MediaProcessOptions as Options, MediaProcess } from 'types/media'

// ----------------------------
// --- Functions --------------
// ----------------------------

export default async function ({ json, options }: Options): Promise<MediaProcess> {
  const { NAMES, PATHS } = generateCache(json, options)

  if (!existsCache(NAMES.jpeg)) {
    await ffmpeg.toJpeg(PATHS.thumbnail, PATHS.jpeg)
  } else {
  }

  if (options.type === 'onlyAudio' && (json as any).formats.audio) {
    if (!existsCache(NAMES.audioMp3)) {
      await ffmpeg.toAudioMp3(PATHS.onlyAudio, PATHS.audioMp3)
    }

    return { path: PATHS.audioMp3, cover: PATHS.jpeg, type: 'audio', format: 'mp3' }
  }

  if (options.type === 'video' && json.platform === 'youtube' && (json as any).formats.audio) {
    let audioKeyName: 'audioAac' | 'audioWebm' = options.vformat === 'mp4' ? 'audioAac' : 'audioWebm'

    if (!existsCache(NAMES[audioKeyName])) {
      if (options.vformat === 'mp4') {
        await ffmpeg.toAudioAac(PATHS.onlyAudio, PATHS.audioAac)
      } else if (options.vformat === 'webm') {
        await ffmpeg.toAudioWebm(PATHS.onlyAudio, PATHS.audioWebm)
      }
    } else {
    }

    if (!existsCache(NAMES.video)) {
      await ffmpeg.toVideo({
        entryVideo: PATHS.onlyVideo,
        entryAudio: PATHS[audioKeyName],
        outFile: PATHS.video,
        type: options.vformat as 'mp4' | 'webm'
      })
    }

    return {
      path: PATHS.video,
      cover: PATHS.jpeg,
      type: 'video',
      format: options.vformat as 'mp4' | 'webm'
    }
  }
  if (options.type === 'video' && json.platform === 'instagram') {
    if (!existsCache(NAMES.video)) {
      await ffmpeg.toVideo({
        entryVideo: PATHS.onlyVideo,
        entryAudio: PATHS.onlyAudio,
        outFile: PATHS.video,
        type: options.vformat as 'mp4' | 'webm'
      })
    }

    return {
      path: PATHS.video,
      cover: PATHS.jpeg,
      type: 'video',
      format: options.vformat as 'mp4' | 'webm'
    }
  }

  if (options.type === 'video' && json.platform === 'tiktok') {
    return {
      path: PATHS.tiktok,
      cover: PATHS.jpeg,
      type: 'video',
      format: 'mp4' as 'mp4' | 'webm'
    }
  }

  // onlyVideo

  return {
    path: PATHS.onlyVideo,
    cover: PATHS.jpeg,
    type: 'video',
    format: options.vformat as 'mp4' | 'webm'
  }
}
