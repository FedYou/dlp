import blessed from 'blessed'
import { screen, render } from 'global/screen'
import { Style, Space, LineBreak, VarLine } from '../utils/baseUi'

enum LABELS {
  TITLE = 'Title',
  DESCRIPTION = 'Description',
  MINIATURE = '[i] Miniature',
  METADATA = '[e] Metadata',
  TOTAL_SIZE = 'Total size download',
  CANCEL = '[c] Cancel',
  DOWNLOAD = '[d] Download',
  SELECT_BT = 'Select Format',
  SELECT_MESSAGE = '[s] Open Selector'
}

interface Ui {
  box: blessed.Widgets.BoxElement
  button: blessed.Widgets.ButtonElement
  list: blessed.Widgets.ListElement
}
interface Radio {
  metadata: boolean
  miniature: boolean
}

interface DataSelected {
  format: string
  quality: number
  language: number
}

interface Data {
  platform: 'youtube' | 'instagram' | 'tiktok'
  title: string
  description: string
  date: string
  duration: string
  totalSize: string
  language: string | null
  formats: {
    mp4: string[]
    webm: string[]
    audio: string | string[] | boolean
  }
}

class Selector {
  // Variables
  private ui: Ui
  private visible: boolean = false
  private data: Data | null = null
  private radio: Radio = {
    metadata: false,
    miniature: false
  }
  private dataSelected: DataSelected | null = null

  private _onSelect: (index: number) => void = () => {}

  constructor(parent: blessed.Widgets.BoxElement) {
    this.ui = {
      box: this.createBox(parent),
      button: null as any,
      list: null as any
    }
    this.ui.button = this.createButton()
    this.ui.list = this.createList()

    this.createkeyboardBindings()

    this.ui.list.on('select', (_, i) => this.onSelect?.(i))

    this.update()
  }

  // Actualizar la ui

  update() {
    if (!this.visible) {
      render()
      return
    }

    this.ui.box.setContent(this.buildBoxContent())
    this.centerELement(this.ui.button)
    this.centerELement(this.ui.list)
    render()
  }

  // ---------------------------------------------
  // Crear elementos de la ui y centrarlos
  // ---------------------------------------------

  private createBox(parent: blessed.Widgets.BoxElement): blessed.Widgets.BoxElement {
    return blessed.box({
      parent,
      width: '75%',
      height: '0%+16',
      border: 'line',
      hidden: true,
      tags: true,
      style: {
        fg: 'cyan',
        border: {
          fg: 'cyan'
        }
      }
    })
  }

  private createButton(): blessed.Widgets.ButtonElement {
    return blessed.button({
      parent: this.ui.box,
      top: '0%+6',
      width: '0%+30',
      height: '0%+3',
      content: Style(LABELS.SELECT_BT)('center') + '',
      tags: true,
      border: 'line',
      style: {
        fg: 'white',
        border: {
          fg: 'yellow'
        }
      }
    })
  }

  private createList(): blessed.Widgets.ListElement {
    return blessed.list({
      parent: this.ui.box,
      top: '0%+2',
      width: '0%+30',
      height: '0%+10',
      keys: true,
      hidden: true,
      scrollbar: {
        ch: ' '
      },
      scrollable: true,
      border: 'line',
      label: Style('Select format')('magenta-fg') + '',
      tags: true,
      style: {
        border: {
          fg: 'magenta'
        },
        scrollbar: {
          bg: 'magenta'
        },
        item: {
          fg: 'white'
        },
        selected: {
          bg: 'magenta'
        }
      }
    })
  }

  private centerELement(element: blessed.Widgets.ButtonElement | blessed.Widgets.ListElement) {
    element.left = `50%-${Math.floor((element.width as number) / 2)}`
  }

  // ---------------------------------------------
  // ---------------------------------------------

  // ---------------------------------------------
  // Construir contenido de la ui del elemento box
  // ---------------------------------------------

  private buildBoxContent(): string {
    if (!this.data) return ''

    const { title, description, date, duration, totalSize } = this.data

    const _title = {
      label: LABELS.TITLE,
      text: title,
      underline: true,
      width: this.boxWidth
    }

    const _description = {
      label: LABELS.DESCRIPTION,
      text: description,
      underline: false,
      width: this.boxWidth
    }

    const _metadata = date.replace(/-/g, '/') + ' - ' + duration

    const _totalSize = Style(LABELS.TOTAL_SIZE + ':') + Space() + Style(totalSize)('bold')

    const lines: string[] = [
      VarLine(_title),
      LineBreak(),
      VarLine(_description),
      LineBreak(2),
      Style(_metadata)('center')('bold')('magenta-fg') + '',
      LineBreak(2),
      this.buildBoxRadio(),
      LineBreak(4),
      Style(LABELS.SELECT_MESSAGE)('center')('yellow-fg') + '',
      LineBreak(2),
      Style(_totalSize)('center') + '',
      LineBreak(2),
      this.buildBoxActions()
    ]
    return lines.join('')
  }

  private buildBoxRadio() {
    const getSimbol = (value: boolean) => (value ? '✔' : '✖')

    const line: string[] = [
      Style(LABELS.METADATA + Style(`(${getSimbol(this.radio.metadata)})`)('bold'))('blue-fg') + '',
      Space(2),
      Style(LABELS.MINIATURE + Style(`(${getSimbol(this.radio.miniature)})`)('bold'))('blue-fg') + ''
    ]

    return Style(line.join(''))('center') + ''
  }

  private buildBoxActions(): string {
    const cancel = Style(LABELS.CANCEL)('red-fg')
    const download = Style(LABELS.DOWNLOAD)('green-fg')
    return Style(cancel + Space() + download)('center')('bold') + ''
  }

  private buildButtonContent(): string {
    if (this.dataSelected === null) {
      return LABELS.SELECT_BT
    }
    const { format, language, quality } = this.dataSelected

    if (format.includes('-audio')) {
      const _format = format.split('-')[0] as 'mp4' | 'webm'
      const _quality = this.data?.formats[_format][quality].split(' ')[0]

      let _language = 'with audio'

      if (language === -1) {
        _language += this.data?.language ? ` (${this.data?.language})` : ''
      }

      return [_format, _quality, _language].join(' ')
    }

    if (format === 'audio') {
      const _format = 'mp3'
      const _language = this.data?.language ? `(${this.data?.language})` : ''
      return [_format, _language].join(' ')
    }

    const _format = format.split('-')[0] as 'mp4' | 'webm'
    const _quality = this.data?.formats[_format][quality].split(' ')[0]

    return [_format, _quality, 'withuot audio'].join(' ')
  }

  // ---------------------------------------------
  // ---------------------------------------------

  // ---------------------------------------------
  // ---------- Atajos de teclado -----------------
  // ---------------------------------------------

  private createkeyboardBindings() {
    const bindings = {
      'c,C,d,D': () => this.hide(),
      'e,E': () => this.toggleRadio('metadata'),
      'i,I': () => this.toggleRadio('miniature'),
      's,S': () => this.openCloseList()
    }
    screen.on('keypress', (_, key) => {
      if (!this.visible) return

      for (const binding in bindings) {
        const keys = binding.includes(',') ? binding.split(',') : binding
        if (keys.includes(key.full)) {
          ;(bindings as any)?.[binding]()
        }
      }
    })
  }

  // ---------------------------------------------
  // ---------------------------------------------

  // ------------------------------------------
  // Añadir los items al selector
  // ------------------------------------------

  private setItems(
    format?: 'mp4' | 'mp4-audio' | 'webm' | 'webm-audio' | 'audio',
    qualityIndex?: number
  ) {
    if (!this.data) return
    const items: string[] = []

    const { platform, formats, language } = this.data

    this.onSelect = (itemIndex) => {
      if (platform === 'tiktok') {
        const _format = formats.audio ? 'mp4-audio' : 'mp4'

        this.dataSelected = { format: _format, quality: itemIndex, language: -1 }

        this.hideList()
        return
      }

      if (format) {
        // Abre la lista de idiomas si es un video con audio
        if (format.includes('-audio') && qualityIndex === undefined && Array.isArray(formats.audio)) {
          this.setItems(format, itemIndex)
          return
        }

        // Guarda la seleccion de formato, calidad y idioma
        // Solo si es un video con audio con mas de un idioma
        if (format.includes('-audio') && qualityIndex !== undefined && Array.isArray(formats.audio)) {
          this.dataSelected = { format, quality: qualityIndex, language: itemIndex }
        }

        // Si el video tiene audio pero no mas de un idioma
        if (format.includes('-audio') && qualityIndex === undefined) {
          this.dataSelected = { format, quality: itemIndex, language: -1 }
        }

        if (format === 'audio' && Array.isArray(formats.audio)) {
          this.dataSelected = { format, quality: -1, language: itemIndex }
        }

        if (format === 'audio' && !Array.isArray(formats.audio)) {
          this.dataSelected = { format, quality: -1, language: -1 }
        }

        // Si es un video sin audio
        if (!format.includes('-audio') && format !== 'audio') {
          this.dataSelected = { format, quality: itemIndex, language: -1 }
        }

        this.hideList()
        return
      }

      const item = items?.[itemIndex].toLocaleLowerCase()
      if (item.startsWith('mp4')) {
        if (item.includes('audio')) {
          this.setItems('mp4-audio')
          return
        }
        this.setItems('mp4')
      } else if (item.startsWith('webm')) {
        if (item.includes('audio')) {
          this.setItems('webm-audio')
          return
        }
        this.setItems('webm')
      } else if (item.startsWith('mp3')) {
        if (Array.isArray(formats.audio)) {
          this.setItems('audio')
          return
        }
        this.dataSelected = { format: 'audio', quality: -1, language: -1 }

        this.hideList()
      }
    }

    // Abre la lista de calidades y idiomas de audio disponibles
    if (format) {
      if (
        format === 'audio' ||
        (format.includes('-audio') && qualityIndex !== undefined && Array.isArray(formats.audio))
      ) {
        this.ui.list.setItems(formats.audio as string[])
        render()
        return
      }

      if (format.includes('-audio')) {
        const _format = format.split('-')[0] as 'mp4' | 'webm'
        this.ui.list.setItems(formats[_format])
      } else {
        const _format = (format.includes(Space()) ? format.split(Space())[0] : format) as 'mp4' | 'webm'
        this.ui.list.setItems(formats[_format])
      }

      render()
      return
    }

    // Abre la lista de formatos disponibles
    if (platform === 'tiktok') {
      this.ui.list.setItems(formats.mp4)
      render()
      return
    }

    if (formats.audio) {
      items.push(`mp4 with audio [${formats.mp4.length}]`)
    }
    items.push(`mp4 [${formats.mp4.length}]`)

    if (platform === 'youtube' && formats.webm !== null) {
      if (formats.audio) {
        items.push(`webm with audio [${formats.webm.length}]`)
      }
      items.push(`webm [${formats.webm.length}]`)
    }

    if (formats.audio) {
      if (typeof formats.audio === 'string') {
        items.push(formats.audio + (language ? ` (${language})` : ''))
      } else if (Array.isArray(formats.audio)) {
        items.push(`mp3 [${formats.audio.length}]`)
      } else {
        items.push('mp3' + (language ? ` (${language})` : ''))
      }
    }

    this.ui.list.setItems(items)
    render()
  }

  // ---------------------------------------------
  // ---------------------------------------------
  private toggleRadio(type: 'metadata' | 'miniature') {
    this.radio[type] = !this.radio[type]
    this.update()
  }

  private openCloseList() {
    this.ui.list.focus()
    // Se conserva el valor de hidden del ui.list
    const previousHidden = this.ui.list.hidden
    // Se cambia el valor de hidden del ui.list a lo contrario
    this.ui.list.hidden = !previousHidden

    // Si el valor de hidden era false se limpia la lista de items
    // Porque la lista era visible pero paso a ser invisible
    if (!previousHidden) {
      this.ui.list.clearItems()
    } else {
      this.setItems()
    }
    render()
  }

  private hideList() {
    this.ui.list.hidden = true
    this.ui.list.clearItems()

    const buttonContent = Style(this.buildButtonContent())('center') + ''
    this.ui.button.setContent(buttonContent)
    render()
  }

  private set onSelect(fn: (index: number) => void) {
    this._onSelect = fn
  }

  private get onSelect(): (index: number) => void {
    return this._onSelect
  }

  // Obtener el ancho del elemento box
  private get boxWidth() {
    return this.ui.box.width as number
  }

  private showHide(visible: boolean) {
    this.visible = visible
    this.ui.box.hidden = !this.ui.box.hidden
    render()
  }

  show() {
    this.showHide(true)
  }

  hide() {
    this.showHide(false)
  }

  clearData() {
    this.data = null
    this.dataSelected = null
  }

  // Establecer la posicion del elemento box
  setPosition(top: string, left: string) {
    this.ui.box.top = top
    this.ui.box.left = left
    render()
  }

  // Se agrega los datos JSON
  setData(data: Data) {
    this.data = data
    this.update()
  }

  // Obtener el elemento box
  get element() {
    return this.ui.box
  }
}

export default Selector
