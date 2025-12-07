export interface FileDownloadProgress {
  progress: number
  speed: string
  eta: string
  byDownload: string
  downloaded: string
}

export interface FileDownloadOptions {
  url: string
  fileName: string
  referer?: string
  cookies?: string
  on?: {
    progress: (data: FileDownloadProgress) => void
    complete: (code: number) => void
  }
}
