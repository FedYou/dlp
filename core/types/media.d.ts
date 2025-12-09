import type { FileDownloadProgress } from './dlf'
import type { JSON } from './json'
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
  json: JSON
  options: DataOptions
  on?: MediaDownloadOn
}

export interface MediaProcessOptions {
  json: JSON
  options: DataOptions
}

export interface MediaProcess {
  path: string
  cover: string
  type: 'video' | 'audio'
  format: 'mp4' | 'webm' | 'mp3'
}
