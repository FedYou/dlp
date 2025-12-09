import './commands'
import './stopExec'
import blessed from 'blessed'
import core from 'dlp-core'
import clipboard from 'clipboardy'
import os from 'os'
import path from 'path'

import { screen, render, destroy } from 'global/screen'
import platformURL from 'dlp-core/src/utils/platformURL'
import getSize from 'dlp-core/src/utils/getSize'

import { Style } from 'utils/baseUi'
import TUIDependecies from './tui/dependencies'

import $Footer from 'components/footer'
import $InputURL from 'components/inputURL'
import $Selector, { Selected } from 'components/selector'
import $DLbar from 'components/dlbar'
import $Dialog from 'components/dialog'
import $Status from 'components/status'

import type { DataOptions as OptionsMedia, MediaProcess } from 'dlp-core/types/media'

type Mode = 'dependencies' | 'input' | 'json' | 'select' | 'download' | 'process' | 'save' | 'error'

class Controller {
  private mode: Mode = 'dependencies'
  private dlp = new core.DLP()

  main = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: '100%',
    height: '100%'
  })

  private ui = {
    dialog: new $Dialog(this.main),
    footer: new $Footer(this.main),
    inputURL: new $InputURL(this.main),
    selector: new $Selector(this.main),
    dlbar: new $DLbar(this.main),
    status: new $Status()
  }

  constructor() {
    this.ui.inputURL.setPosition('50%-2', 'center')
    this.ui.selector.setPosition('center', 'center')
    this.ui.dlbar.setPosition('center', 'center')
    this.ui.status.setPosition('85%', 'center')
    this.ui.status.type('any')

    this.main.append(this.ui.dialog.element)
    this.main.append(this.ui.footer.element)
    this.main.append(this.ui.inputURL.element)
    this.main.append(this.ui.selector.element)
    this.main.append(this.ui.dlbar.element)
    this.main.append(this.ui.status.element)

    this.setkeyboardBindings()
    this.setFooter()
    this.dependenciesMode()
  }

  private setFooter() {
    let content = ['[q | C-c] exit']

    if (this.mode === 'error' || this.mode === 'save') {
      content.push('[a] back')
    }
    this.ui.footer.content = content.join(', ')
  }

  private async dependenciesMode() {
    if (this.mode !== 'dependencies') return
    const lines: string[] = [Style('Checking dependencies...')('cyan-fg') + '']
    this.ui.dialog.visible = true
    this.ui.dialog.content = lines.join('\n')
    this.ui.status.type('loading')

    const dependencies = await core.Dependencies.status()

    if (!dependencies['all-installed'] || !dependencies.list.ytdlp.lastest) {
      lines.length = 0
      lines.push(Style('Fix dependencies')('bold')('red-fg') + '')
      lines.push(TUIDependecies(dependencies))
      this.ui.dialog.content = lines.join('\n')
      return
    }

    this.ui.dialog.visible = false
    this.mode = 'input'
    this.inputMode()
  }

  private inputMode() {
    if (this.mode !== 'input') return
    this.ui.inputURL.status = null
    this.ui.inputURL.visible = true
    this.ui.status.type('any')
  }

  private pasteURL() {
    if (this.mode !== 'input') return
    const clipboardValue = clipboard.readSync()
    if (platformURL(clipboardValue) !== null) {
      this.ui.inputURL.status = 'valid'
      this.ui.inputURL.value = clipboardValue
    } else {
      this.ui.inputURL.status = 'invalid'
      this.ui.inputURL.value = clipboardValue
    }
  }

  private loadURL() {
    if (this.mode !== 'input') return
    if (this.ui.inputURL.status !== 'valid') return

    const url = this.ui.inputURL.value as string

    this.ui.inputURL.value = null
    this.mode = 'json'
    this.jsonMode(url)
  }

  private async jsonMode(url: string) {
    if (this.mode !== 'json') return
    this.ui.dialog.visible = true
    this.ui.dialog.content = Style('Obtaining JSON...')('green-fg') + ''
    this.ui.status.type('loading')

    try {
      await this.dlp.addURL(url)
    } catch (error) {
      this.mode = 'error'
      this.errorMode((error as Error).message)
      return
    }

    this.mode = 'select'
    this.selectMode()
  }

  private selectMode() {
    if (this.mode !== 'select') return
    if (!this.ui.selector.visible) {
      this.ui.selector.visible = true
    }
    this.ui.selector.setData(this.toSelectorData())
    this.ui.status.type('any')
  }

  private toSelectorData() {
    const info = this.dlp.info
    const formats = this.dlp.formats

    const data = {
      platform: info.platform as 'youtube' | 'instagram' | 'tiktok',
      title: info.title,
      description: info.description,
      date: info.upload_date,
      duration: info.duration,
      totalSize: '---',
      language: info.language ?? null,
      formats: {
        audio: false as any,
        mp4: formats.mp4.map(
          (format) => `${format.resolution_note} (${getSize(format.filesize as any)})`
        ),
        webm: null as any
      }
    }

    if (data.platform === 'youtube') {
      data.formats.webm =
        formats.webm?.map(
          (format) => `${format.resolution_note} (${getSize(format.filesize as any)})`
        ) ?? []

      if (formats.audio) {
        data.formats.audio = []

        for (const key in (formats as any).audio) {
          const audio = (formats as any).audio[key]
          data.formats.audio.push(`${audio.language} (${getSize(audio.filesize) ?? 0})`)
        }
      }
    }

    if (data.platform === 'instagram' && this.dlp.isAudioAvailable()) {
      data.formats.audio = `mp3 (${getSize((formats as any).audio.filesize) ?? 0})`
    } else if (data.platform !== 'youtube') {
      data.formats.audio = this.dlp.isAudioAvailable()
    }

    return data
  }

  private backInputModeFromSelector() {
    if (this.mode === 'select') {
      this.ui.selector.clearData()
      this.mode = 'input'
      this.inputMode()
      this.setFooter()
    }
  }

  private startDownload() {
    if (this.mode !== 'select') return
    const data = this.toOptionsMedia(this.ui.selector.getSelected())
    if (data === null) {
      this.ui.selector.visible = true
      return
    }
    this.ui.selector.clearData()
    this.mode = 'download'
    this.downloadMode(data)
  }

  private toOptionsMedia(selected: Selected | null): OptionsMedia | null {
    if (selected === null) return null

    const { format, quality, language } = selected
    const info = this.dlp.info
    const formats = this.dlp.formats

    const data: OptionsMedia = {
      type: null as any
    }

    if (format.includes('-audio')) {
      data.type = 'video'
      data.vquality = quality
      data.vformat = format.split('-')[0] as 'mp4' | 'webm'
    }

    if (format === 'audio') {
      data.type = 'onlyAudio'
    } else if (!format.includes('-audio')) {
      data.type = 'onlyVideo'
      data.vquality = quality
      data.vformat = format as 'mp4' | 'webm'
    }

    if (info.platform === 'youtube' && data.type !== 'onlyVideo') {
      if (language === -1 && info?.language) {
        data.language = (formats.audio as any)[info.language]
      }
      if (language !== -1 && Array.isArray(formats.audio)) {
        data.language = formats.audio[language]
      }
    }

    return data
  }

  private async downloadMode(data: OptionsMedia) {
    if (this.mode !== 'download') return
    this.ui.dlbar.visible = true
    this.ui.status.type('downloading')

    const status = setInterval(() => {
      this.ui.dlbar.setProgress(this.dlp.downloadStatus.progress)
      this.ui.dlbar.setType(this.dlp.downloadStatus.type)
    }, 100)

    await this.dlp.getMedia(data)

    clearInterval(status)
    this.ui.dlbar.visible = false
    this.mode = 'process'
    await this.processMode(data)
  }

  private async processMode(data: OptionsMedia) {
    if (this.mode !== 'process') return
    this.ui.dialog.visible = true
    this.ui.dialog.content = Style('Processing...')('green-fg') + ''
    this.ui.status.type('processing')

    const output = await this.dlp.processMedia(data)

    this.mode = 'save'
    this.saveMode(output)
  }

  private async saveMode(output: MediaProcess) {
    if (this.mode !== 'save') return

    const radio = this.ui.selector.getRadio()
    const dir = path.join(os.homedir(), 'dlp')
    let ext = '.' + output.format

    const fileName = this.dlp.info.title + `[${Math.random().toString(36).slice(2)}]` + ext

    await this.dlp.saveMedia({ dir, fileName, cover: radio.miniature, metadata: radio.metadata })

    this.mode = 'save'
    this.ui.dialog.content = Style(`Saved in ${dir}/${fileName}`)('green-fg') + ''
    this.setFooter()
    this.ui.status.type('success')
  }

  private errorMode(message: string) {
    if (this.mode !== 'error') return
    this.ui.dialog.visible = true
    this.ui.dialog.content = Style(message)('bold')('red-fg') + ''
    this.setFooter()
    this.ui.status.type('error')
  }

  private backInputMode() {
    if (this.mode === 'error' || this.mode === 'save') {
      this.ui.dialog.visible = false
      this.ui.dialog.content = ''
      this.mode = 'input'
      this.inputMode()
      this.setFooter()
    }
  }

  private exit() {
    destroy()
    process.exit(0)
  }

  // ---------------------------------------------
  // ---------- Atajos de teclado -----------------
  // ---------------------------------------------

  private setkeyboardBindings() {
    screen.key(['C-c', 'q'], () => this.exit())
    // Input Mode
    screen.key(['x'], () => this.pasteURL())
    screen.key(['d'], () => this.loadURL())
    // Back Input Mode
    screen.key(['a'], () => this.backInputMode())
    // Select Mode
    screen.key(['c'], () => this.backInputModeFromSelector())
    screen.key(['d'], () => this.startDownload())
  }

  // ---------------------------------------------
  // ---------------------------------------------
}

const controller = new Controller()

screen.append(controller.main)

render()
