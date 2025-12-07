import type { FileDownloadProgress } from './dlf'
import type { JSONIG, JSONTK, JSONYT } from './json'
export interface DataOptions {
  /**
   * Type
   *
   * Youtube: onlyVideo | onlyAudio | video
   *
   * Instagram: onlyVideo | onlyAudio | video
   *
   * Tiktok: video
   */
  type: 'onlyVideo' | 'onlyAudio' | 'video'
  language?: string
  vformat?: 'mp4' | 'webm'
  vquality?: number
}

export interface MediaDownloadOn {
  start: (type: 'video' | 'audio' | 'thumbnail') => void
  progress: (data: FileDownloadProgress) => void
  complete: (type: 'video' | 'audio' | 'thumbnail', code: number) => void
}

export interface MediaDownloadOptions {
  json: JSONIG | JSONTK | JSONYT
  options: DataOptions
  on?: MediaDownloadOn
}

interface MediaProcessOn {
  start: (type: 'video' | 'audio' | 'thumbnail') => void
  complete: (type: 'video' | 'audio' | 'thumbnail', code: number) => void
}

export interface MediaProcessOptions {
  json: JSONIG | JSONTK | JSONYT
  options: DataOptions
  on?: MediaProcessOn
}
