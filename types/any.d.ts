import type { FileDownloadProgress } from './dlf'

export interface VideoInfo {
  title: string
  uploader: string
  description: string
  upload_date: string
  duration: string
  thumbnail: string
  id: string
  platform: string
  views?: string
  language?: string
}

export interface Metadata {
  title: string
  artist: string
  description: string
}

export interface DependencyStatusFormat {
  installed: boolean
  version: string | null
  lastest: boolean | null
}

export interface DependenciesStatusList {
  ytdlp: DependencyStatusFormat
  ffmpeg: DependencyStatusFormat
  deno: DependencyStatusFormat
  aria2: DependencyStatusFormat
}

export interface DependenciesStatus {
  'all-installed': boolean
  list: DependenciesStatusList
}

export interface Status {
  status:
    | 'ready'
    | 'JSON'
    | 'JSONComplete'
    | 'downloadingStart'
    | 'downloading'
    | 'downloadingComplete'
    | 'processing'
    | 'processingComplete'
    | 'saving'
    | 'saved'
  type: 'video' | 'audio' | 'thumbnail' | 'json' | 'none'
  download: FileDownloadProgress
  downloaded: {
    audio: boolean
    video: boolean
    thumbnail: boolean
  }
  processed: {
    audio: boolean
    video: boolean
    thumbnail: boolean
  }
}

export interface CacheStats {
  unknown: string
  audio: string
  image: string
  video: string
  text: string
  total: string
}
