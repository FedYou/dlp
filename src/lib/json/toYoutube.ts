import getDate from 'utils/getDate'

// ----------------------------
// --- Types ------------------
// ----------------------------
import type { JSONYT, FormatVideoYT, FormatAudioYT } from 'types/json'

// ----------------------------
// --- Variables --------------
// ----------------------------

const FORMAT_NOTE_VIDEO = /\b\d{3,4}p\d*(?:\s*\(\d+\))?\b/

// ----------------------------
// --- Functions --------------
// ----------------------------

function formatVideo(format: any): FormatVideoYT {
  return {
    ext: format.ext,
    filesize: format.filesize_approx,
    vcodec: format.vcodec,
    fps: format.fps,
    resolution: format.resolution,
    format: format.format_note,
    url: format.url
  }
}

function formatAudio(format: any): FormatAudioYT {
  return {
    language: format.language,
    ext: format.ext,
    filesize: format.filesize_approx,
    abr: format.abr,
    acodec: format.acodec,
    url: format.url,
    format_id: format.format_id,
    format_note: format.format_note
  }
}

function betterAudio(audios: any[]) {
  if (audios.length === 1) {
    return audios[0]
  }
  let best: any = null

  for (const audio of audios) {
    if (best === null || audio.abr > best.abr) {
      best = audio
    }
  }
  return best
}

export default function (json: any): JSONYT {
  const formats = {
    mp4: [] as any,
    webm: null as any,
    audio: null as any
  }
  json.formats.forEach((format: any) => {
    if (FORMAT_NOTE_VIDEO.test(format.format_note as string)) {
      if (format.container === 'mp4_dash' || format.ext === 'mp4') {
        formats.mp4.push(formatVideo(format))
      } else {
        if (formats.webm === null) {
          formats.webm = []
        }
        formats.webm.push(formatVideo(format))
      }
      return
    }

    if (format.resolution === 'audio only') {
      if (formats.audio === null) {
        formats.audio = {}
      }

      if (!formats.audio[format.language]) {
        formats.audio[format.language] = []
      }
      formats.audio[format.language].push(formatAudio(format))
    }
  })

  for (const lang in formats.audio) {
    formats.audio[lang] = betterAudio(formats.audio[lang])
  }

  formats.mp4 = formats.mp4.reverse()

  if (formats.webm !== null) {
    formats.webm = formats.webm.reverse()
  }

  return {
    platform: 'youtube',
    language: json.language,
    title: json.title,
    uploader: json.uploader,
    description: json.description,
    upload_date: getDate(json.upload_date),
    duration: json.duration_string,
    thumbnail: json.thumbnail,
    id: json.id,
    views: json.view_count,
    formats
  }
}
