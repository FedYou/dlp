import getDate from 'utils/getDate'

// ----------------------------
// --- Types ------------------
// ----------------------------

import type { JSONTK, FormatVideoDefault } from 'types/json'

// ----------------------------
// --- Functions --------------
// ----------------------------

function formatVideo(format: any): FormatVideoDefault {
  return {
    ext: format.ext,
    filesize: format.filesize,
    vcodec: format.vcodec,
    resolution: format.resolution.split('x')[0] + 'p',
    url: format.url
  }
}

export default function (json: any): JSONTK {
  const formats: {
    mp4: FormatVideoDefault[]
    audio: true | null
  } = {
    mp4: [],
    audio: null
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
