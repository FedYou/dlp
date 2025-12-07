export interface FormatVideoDefault {
  ext: string
  filesize: string
  vcodec: string
  resolution: string
  url: string
}

export interface FormatAudioDefault {
  ext: string
  filesize: string
  abr: string
  acodec: string
  url: string
}

export interface FormatVideoYT extends FormatVideoDefault {
  fps: string
  format: string
}

export interface FormatAudioYT extends FormatAudioDefault {
  language: string
  format_id: string
  format_note: string
}

export interface JSONIG {
  platform: 'instagram'
  title: string
  uploader: string
  description: string
  upload_date: string
  duration: string
  thumbnail: string
  id: string
  formats: {
    audio: FormatAudioDefault | null
    mp4: FormatVideoDefault[]
  }
}

export interface JSONYT {
  platform: 'youtube'
  language: string
  title: string
  uploader: string
  description: string
  upload_date: string
  duration: string
  thumbnail: string
  id: string
  views: string
  formats: {
    mp4: FormatVideoYT[]
    webm: FormatVideoYT[] | null
    audio: {
      [key: string]: FormatAudioYT[]
    } | null
  }
}

export interface JSONTK {
  platform: 'tiktok'
  title: string
  uploader: string
  description: string
  upload_date: string
  duration: string
  thumbnail: string
  cookies: string
  referer: string
  id: string
  formats: {
    mp4: FormatVideoDefault[]
    audio: true | null
  }
}
