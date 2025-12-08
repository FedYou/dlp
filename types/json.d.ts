export interface FormatVideo {
  ext: string
  filesize: string
  codec: string
  resolution: string
  resolution_note: string
  /** Youtube */
  fps?: string
  url: string
}

export interface FormatAudio {
  ext: string
  filesize: string
  abr: string
  codec: string
  language?: string
  url: string
}

export interface FormatAudioLanguages {
  [key: string]: FormatAudio[]
}

export interface JSON {
  platform: 'youtube' | 'instagram' | 'tiktok'
  title: string
  uploader: string
  description: string
  upload_date: string
  duration: string
  thumbnail: string
  /** Youtube */
  language?: string
  /** Youtube */
  views?: string
  /** Tiktok */
  cookies?: string
  /** Tiktok */
  referer?: string
  id: string
  formats: {
    audio: FormatAudio | FormatAudioLanguages | boolean
    mp4: FormatVideo[]
    webm: FormatVideo | null
  }
}
