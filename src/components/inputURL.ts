import blessed from 'blessed'
import { screen, render } from 'global/screen'

enum LABEL {
  INPUT_URL_TOP = 'URL',
  INPUT_URL_BOTTOM = '[x] Insert URL - [d] Start download',
  INPUT_URL_MESSAGE = 'Insert a valid URL',
  INPUT_URL_INVALID = 'Invalid URL',
  INPUT_URL_VALID = 'Valid URL',
  INPUT_URL_VOID = 'Without URL'
}

interface Ui {
  input: blessed.Widgets.TextboxElement
  message: blessed.Widgets.TextElement
  status: blessed.Widgets.TextElement
}

export default class InputURL {
  private ui: Ui

  private _value: string | null = null
  private _visible: boolean = false

  constructor(parent: blessed.Widgets.BoxElement) {
    this.ui = {
      input: this.createInput(parent),
      message: null as any,
      status: null as any
    }
    this.ui.message = this.createMessage()
    this.ui.status = this.createStatus()

    screen.on('resize', () => this.update())

    screen.on('keypress', (_, key) => {
      if (key.full === 'd') {
        this.visible = false
      }
    })
  }

  // Actualizar la ui

  update() {
    if (!this._visible) return

    this.ui.input.setLabel(LABEL.INPUT_URL_TOP)

    if (this._value === null) {
      this.ui.input.value = LABEL.INPUT_URL_VOID
    } else {
      this.ui.input.value = this._value
    }

    this.ui.message.left = `50%-${Math.floor(LABEL.INPUT_URL_BOTTOM.length / 1.8)}`
    this.ui.status.left = `center`

    render()
  }

  // ---------------------------------------------
  // Crear elementos de la ui
  // ---------------------------------------------
  private createInput(parent: blessed.Widgets.BoxElement): blessed.Widgets.TextboxElement {
    return blessed.textbox({
      parent,
      top: '50%',
      left: 'center',
      width: '50%',
      height: 3,
      border: 'line',
      hidden: true,
      style: {
        fg: 'white',
        border: {
          fg: 'yellow'
        },
        label: {
          fg: 'yellow',
          bold: true
        }
      }
    })
  }

  private createMessage(): blessed.Widgets.TextElement {
    return blessed.text({
      parent: this.ui.input,
      top: '50%',
      width: 'shrink',
      height: '5%',
      content: LABEL.INPUT_URL_BOTTOM,
      style: {
        fg: 'yellow'
      }
    })
  }

  private createStatus(): blessed.Widgets.TextElement {
    return blessed.text({
      parent: this.ui.input,
      top: '50%+2',
      width: 'shrink',
      height: '5%'
    })
  }

  // ---------------------------------------------
  // ---------------------------------------------

  setStatus(type: 'invalid' | 'valid' | null) {
    if (type === 'invalid') {
      this.ui.status.setContent(LABEL.INPUT_URL_INVALID)
      this.ui.status.style.fg = 'red'
      this.update()
      return
    }
    if (type === 'valid') {
      this.ui.status.setContent(LABEL.INPUT_URL_VALID)
      this.ui.status.style.fg = 'green'
      this.update()
      return
    }

    this.ui.status.setContent('')
    this.ui.status.style.fg = 'white'
    this.update()
  }

  set value(value: string | null) {
    this._value = value
    this.update()
  }

  get value() {
    return this._value
  }

  set visible(visible: boolean) {
    this._visible = visible
    this.ui.input.hidden = !this._visible
    this.update()
  }

  setPosition(top: string, left: string) {
    this.ui.input.top = top
    this.ui.input.left = left
    render()
  }

  get element() {
    return this.ui.input
  }
}
