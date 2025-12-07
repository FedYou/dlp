import getDate from 'utils/getDate'

// ----------------------------
// --- Types ------------------
// ----------------------------

import type { JSONIG, FormatVideoDefault, FormatAudioDefault } from 'types/json'

// ----------------------------
// --- Functions --------------
// ----------------------------

function formatVideo(format: any): FormatVideoDefault {
  return {
    ext: format.ext,
    filesize: format.filesize_approx,
    vcodec: format.vcodec,
    resolution: format.resolution.split('x')[0] + 'p',
    url: format.url
  }
}

function formatAudio(format: any): FormatAudioDefault {
  return {
    ext: format.ext,
    filesize: format.filesize_approx,
    abr: format.abr,
    acodec: format.acodec,
    url: format.url
  }
}
export default function (json: any): JSONIG {
  const formats: {
    audio: FormatAudioDefault | null
    mp4: FormatVideoDefault[]
  } = {
    audio: null,
    mp4: []
  }

  json.formats.forEach((format: any) => {
    if (format.format_note === 'DASH video') {
      formats.mp4.push(formatVideo(format))
      return
    }

    if (format.format_note === 'DASH audio') {
      formats.audio = formatAudio(format)
      return
    }
  })

  formats.mp4 = formats.mp4.reverse()

  return {
    platform: 'instagram',
    title: json.title,
    uploader: json.uploader,
    description: json.description,
    upload_date: getDate(json.upload_date),
    duration: json.duration_string,
    thumbnail: json.thumbnail,
    id: json.id,
    formats
  }
}
