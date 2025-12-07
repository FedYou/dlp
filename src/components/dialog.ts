import blessed from 'blessed'
import { screen, render } from 'global/screen'

class Dialog {
  element: blessed.Widgets.BoxElement

  private _visible: boolean = false
  private _content: string = ''

  constructor(parent: blessed.Widgets.BoxElement) {
    this.element = blessed.box({
      parent,
      top: 'center',
      left: 'center',
      width: 'shrink',
      height: 'shrink',
      hidden: true,
      tags: true
    })

    screen.on('resize', () => this.update())
  }

  update() {
    if (!this._visible) return
    this.element.setContent(this._content)
    render()
  }

  set visible(visible: boolean) {
    this._visible = visible
    this.element.hidden = !this._visible
    if (!this._visible) {
      this._content = ''
    }
    render()
  }

  set content(content: string) {
    this._content = content
    this.update()
  }
}

export default Dialog
