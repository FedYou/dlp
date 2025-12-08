import path from 'path'
import youfile from 'youfile'
import downloadMedia from 'lib/dlm'
import ffmpeg from 'lib/ffmpeg'
import processMedia from 'lib/processMedia'
import getJSON from 'lib/json/get'
import toJSONYT from 'lib/json/toYoutube'
import toJSONIG from 'lib/json/toInstagram'
import toJSONTK from 'lib/json/toTiktok'
import platformURL from 'utils/platformURL'
import getSize from 'utils/getSize'

import type { DataOptions, MediaDownloadOn, MediaProcessOn } from 'types/media'
import type { FileDownloadProgress } from 'types/dlf'
import type { VideoInfo, Metadata, Status } from 'types/any'
import type { FormatVideo, FormatAudio, FormatAudioLanguages } from 'types/json'

export default class DLP {
  private url: any
  private dumpJSON: any
  private json: any
  private platform: any
  private output: any
  private _status: Status = {
    status: 'ready',
    type: 'none',
    download: {
      progress: 0,
      speed: '---',
      eta: '---',
      byDownload: '---',
      downloaded: '---'
    },
    downloaded: {
      audio: false,
      video: false,
      thumbnail: false
    },
    processed: {
      audio: false,
      video: false,
      thumbnail: false
    }
  }

  async addURL(url: string) {
    this.url = url
    this.platform = platformURL(url)

    if (this.platform === null) {
      throw new Error('Invalid URL', {
        cause: {
          code: 'INVALID_URL',
          value: url
        }
      })
    }

    if (this.output) this.output = ''
    this._status.status = 'JSON'
    this._status.type = 'json'
    await this.getJSON()
    this._status.status = 'JSONComplete'
    this._status.type = 'none'
  }

  private async getJSON() {
    this.dumpJSON = await getJSON(this.url)
    if (!this.dumpJSON) {
      throw new Error('Error obtaining JSON', {
        cause: {
          code: 'JSON_OBTAIN'
        }
      })
    }
    if (this.platform === 'youtube') {
      this.json = toJSONYT(this.dumpJSON)
    } else if (this.platform === 'instagram') {
      this.json = toJSONIG(this.dumpJSON)
    } else if (this.platform === 'tiktok') {
      this.json = toJSONTK(this.dumpJSON)
    }
  }

  private setErrorNoJSON() {
    throw new Error('Error no JSON Data', {
      cause: {
        code: 'NO_JSON_DATA'
      }
    })
  }

  async getMedia(options: DataOptions) {
    if (!this.json) this.setErrorNoJSON()
    if (options.type === 'onlyAudio' && this.platform === 'tiktok') {
      throw new Error('Cannot extract the audio from TikTok videos separately', {
        cause: {
          code: 'AUDIO_NOT_AVAILABLE_TIKTOK'
        }
      })
    }
    if (options.type === 'video' || options.type === 'onlyAudio') {
      if (!this.json.formats.audio && this.platform !== 'tiktok') {
        throw new Error('Audio no available in this video', {
          cause: {
            code: 'AUDIO_NOT_AVAILABLE'
          }
        })
      }
    }

    await downloadMedia({ json: this.json, options, on: this.onDownload() })
    this.output = await processMedia({ json: this.json, options, on: this.onProcess() })
  }

  getMediaSizeTotal({ type, vformat, vquality, language }: DataOptions) {
    if (!this.json) this.setErrorNoJSON()
    let amount = 0
    const { audio } = this.json.formats
    if ((type === 'onlyAudio' || type === 'video') && this.platform === 'instagram') {
      amount += audio?.filesize ?? 0
    }

    if (this.platform === 'youtube' && (type === 'video' || type === 'onlyAudio')) {
      const _language = audio[language as any] ?? audio[this.json.language]
      amount += (_language as any)?.filesize ?? 0
    }

    if (type === 'video' || type === 'onlyVideo') {
      const _vformat = this.platform === 'youtube' ? vformat : 'mp4'
      amount += this.json.formats[_vformat as any][vquality as any]?.filesize ?? 0
    }

    return getSize(amount)
  }

  private onDownload(): MediaDownloadOn {
    const complete = (type: 'video' | 'audio' | 'thumbnail', _: number) => {
      this._status.status = 'downloadingComplete'
      this._status.type = type
      this._status.downloaded[type] = true
      this._status.download = {
        progress: 0,
        speed: '---',
        eta: '---',
        byDownload: '---',
        downloaded: '---'
      }
    }
    const start = (type: 'video' | 'audio' | 'thumbnail') => {
      this._status.status = 'downloadingStart'
      this._status.type = type
      this._status.download = {
        progress: 0,
        speed: '---',
        eta: '---',
        byDownload: '---',
        downloaded: '---'
      }
    }
    const progress = (data: FileDownloadProgress) => {
      this._status.status = 'downloading'
      this._status.download = data
    }
    return { complete, progress, start }
  }

  private onProcess(): MediaProcessOn {
    const complete = (type: 'video' | 'audio' | 'thumbnail') => {
      this._status.status = 'processingComplete'
      this._status.processed[type] = true
    }
    const start = (type: 'video' | 'audio' | 'thumbnail') => {
      this._status.status = 'processing'
      this._status.type = type
    }

    return { complete, start }
  }

  async saveMedia({
    dir,
    fileName,
    cover = false,
    metadata = false
  }: {
    dir: string
    fileName: string
    cover?: boolean
    metadata?: boolean
  }) {
    if (!this.output) {
      throw new Error('Error no media data', {
        cause: {
          code: 'NO_MEDIA_DATA'
        }
      })
    }
    this._status.status = 'saving'
    if (cover) {
      if (this.output.type === 'video' && this.output.format === 'mp4') {
        await ffmpeg.toMp4Cover({
          entryVideo: this.output.path,
          entryCover: this.output.cover,
          outFile: path.join(dir, fileName),
          metadata: this.getMetadata()
        })
        return
      }
      if (this.output.type === 'audio') {
        await ffmpeg.toMp3Cover({
          entryAudio: this.output.path,
          entryCover: this.output.cover,
          outFile: path.join(dir, fileName),
          metadata: this.getMetadata()
        })
        return
      }
    }

    if (metadata) {
      await ffmpeg.addMetadata(this.output.path, path.join(dir, fileName), this.getMetadata())
      return
    }
    await youfile.copy(this.output.path, path.join(dir, fileName))
    this._status.status = 'saved'
    this._status.type = this.output.type
  }
  get status(): Status {
    return this._status
  }

  get info(): VideoInfo {
    if (!this.json) this.setErrorNoJSON()
    const data: VideoInfo = {
      title: this.json.title,
      uploader: this.json.uploader,
      description: this.json.description,
      upload_date: this.json.upload_date,
      duration: this.json.duration,
      thumbnail: this.json.thumbnail,
      id: this.json.id,
      platform: this.json.platform
    }
    if (this.json.views) data.views = this.json.views
    if (this.json.language) data.language = this.json.language

    return data
  }

  get formats(): {
    audio: FormatAudio | FormatAudioLanguages | boolean
    mp4: FormatVideo[]
    webm: FormatVideo | null
  } {
    if (!this.json) this.setErrorNoJSON()
    return this.json.formats
  }

  isAudioAvailable(): boolean {
    if (!this.json) this.setErrorNoJSON()
    return this.json.formats.audio
  }

  private getMetadata(): Metadata {
    if (!this.json) this.setErrorNoJSON()
    return {
      title: this.json.title,
      artist: this.json.uploader,
      description: this.json.description
    }
  }
}
