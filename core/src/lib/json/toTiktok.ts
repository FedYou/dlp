import getDate from 'utils/getDate'

// ----------------------------
// --- Types ------------------
// ----------------------------

import type { JSON, FormatVideo } from 'types/json'

// ----------------------------
// --- Functions --------------
// ----------------------------

function formatVideo(format: any): FormatVideo {
  return {
    ext: format.ext,
    filesize: format.filesize,
    codec: format.vcodec,
    resolution: format.resolution,
    resolution_note: format.resolution.split('x')[0] + 'p',
    url: format.url
  }
}

export default function (json: any): JSON {
  const formats: {
    mp4: FormatVideo[]
    webm: null
    audio: boolean
  } = {
    mp4: [],
    webm: null,
    audio: false
  }

  if (json.acodec === 'aac') formats.audio = true
  json.formats.forEach((format: any) => {
    if (format.format_note !== 'watermarked') {
      formats.mp4.push(formatVideo(format))
      return
    }
  })

  formats.mp4 = formats.mp4.reverse()

  return {
    platform: 'tiktok',
    title: json.title,
    uploader: json.uploader,
    description: json.description,
    upload_date: getDate(json.upload_date),
    duration: json.duration_string,
    thumbnail: json.thumbnail,
    cookies: json.cookies,
    referer: json.original_url,
    id: json.id,
    formats
  }
}
