import blessed from 'blessed'
import { render, screen } from 'global/screen'

enum LABEL {
  DOWNLOADING_VIDEO = 'Downloading video',
  DOWNLOADING_AUDIO = 'Downloading audio',
  DOWNLOADING_THUMBNAIL = 'Downloading thumbnail'
}

interface Chars {
  complete: string
  incomplete: string
}

interface Ui {
  bar: blessed.Widgets.BoxElement
  label: {
    top: blessed.Widgets.TextElement
    bottom: blessed.Widgets.TextElement
  }
}

interface Progress {
  progress: number
  speed: string
  eta: string
  byDownload: string
  downloaded: string
}

export default class ProgressBar {
  private chars: Chars = {
    complete: '█',
    incomplete: '░'
  }

  private ui: Ui
  private _visible: boolean = false

  private _progress: Progress | null = null
  private _type: 'video' | 'audio' | 'thumbnail' | 'none' = 'none'

  constructor(parent: blessed.Widgets.BoxElement) {
    this.ui = {
      bar: this.createBar(parent),
      label: {
        top: null as any,
        bottom: null as any
      }
    }
    this.ui.label.top = this.createLabelTop()
    this.ui.label.bottom = this.createLabelBottom()

    screen.on('resize', () => this.update())
  }

  // Actualizar la ui

  update() {
    if (!this._visible || this._progress === null) return

    const progress = this._progress.progress
    this.ui.bar.setContent(this.buildBar(progress))

    const label = {
      top: this.buildLabelTop(),
      bottom: this.buildLabelBottom()
    }

    this.ui.label.top.setContent(label.top)
    this.ui.label.bottom.setContent(label.bottom)

    // Arriba a la izquierda
    this.ui.label.top.left = `75%-${Math.round(label.top.length / 2)}`

    // Abajo al centro
    this.ui.label.bottom.left = `50%-${Math.floor(label.bottom.length / 1.8)}`

    if (this._type !== 'none') {
      this.setLabelBar(this._type)
    }

    render()
  }

  // ---------------------------------------------
  // Crear elementos de la ui
  // ---------------------------------------------

  private createBar(parent: blessed.Widgets.BoxElement): blessed.Widgets.BoxElement {
    return blessed.box({
      parent,
      width: '75%',
      height: '0%+3',
      border: 'line',
      hidden: true,
      style: {
        border: {
          fg: 'cyan'
        },
        label: {
          fg: 'cyan',
          bold: true
        },
        fg: 'cyan'
      }
    })
  }

  private createLabelTop() {
    return blessed.text({
      parent: this.ui.bar,
      top: '0%-1',
      width: 'shrink',
      height: '5%',
      style: {
        fg: 'cyan'
      }
    })
  }

  private createLabelBottom() {
    return blessed.text({
      parent: this.ui.bar,
      top: '0%+1',
      width: 'shrink',
      height: '5%',
      style: {
        fg: 'cyan'
      }
    })
  }

  // ---------------------------------------------
  // ---------------------------------------------

  // ---------------------------------------------
  // Construir contenido de la ui
  // ---------------------------------------------

  private buildBar(progress: number) {
    const width = (this.ui.bar.width as number) - 5 - progress.toString().length
    const complete = Math.floor((progress / 100) * width)
    const barIncomplete = this.chars.incomplete.repeat(width - complete)
    const barComplete = this.chars.complete.repeat(complete)
    return `${progress}%[${barComplete}${barIncomplete}]`
  }

  private buildLabelTop() {
    return `${this._progress?.downloaded}/${this._progress?.byDownload}`
  }

  private buildLabelBottom() {
    return `Speed ${this._progress?.speed} ETA ${this._progress?.eta}`
  }

  // ---------------------------------------------
  // ---------------------------------------------

  private setLabelBar(type: 'video' | 'audio' | 'thumbnail') {
    if (type === 'video') {
      this.ui.bar.setLabel(LABEL.DOWNLOADING_VIDEO)
    } else if (type === 'audio') {
      this.ui.bar.setLabel(LABEL.DOWNLOADING_AUDIO)
    } else {
      this.ui.bar.setLabel(LABEL.DOWNLOADING_THUMBNAIL)
    }
    render()
  }

  set visible(visible: boolean) {
    this._visible = visible
    this.ui.bar.hidden = !this._visible
    if (!this._visible) {
      this._progress = null
      this._type = 'none'
    }
    render()
  }

  setPosition(top: string, left: string) {
    this.ui.bar.top = top
    this.ui.bar.left = left
    render()
  }

  setProgress(progress: Progress) {
    this._progress = progress
    this.update()
  }

  setType(type: 'video' | 'audio' | 'thumbnail' | 'none') {
    this._type = type
    this.update()
  }

  get element() {
    return this.ui.bar
  }
}
