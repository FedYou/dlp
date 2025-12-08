import getDate from 'utils/getDate'

// ----------------------------
// --- Types ------------------
// ----------------------------

import type { JSON, FormatVideo, FormatAudio } from 'types/json'

// ----------------------------
// --- Functions --------------
// ----------------------------

function formatVideo(format: any): FormatVideo {
  return {
    ext: format.ext,
    filesize: format.filesize_approx,
    codec: format.vcodec,
    resolution: format.resolution,
    resolution_note: format.resolution.split('x')[0] + 'p',
    url: format.url
  }
}

function formatAudio(format: any): FormatAudio {
  return {
    ext: format.ext,
    filesize: format.filesize_approx,
    abr: format.abr,
    codec: format.acodec,
    url: format.url
  }
}
export default function (json: any): JSON {
  const formats: {
    mp4: FormatVideo[]
    webm: null
    audio: FormatAudio | boolean
  } = {
    mp4: [],
    webm: null,
    audio: false
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
