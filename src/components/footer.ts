import blessed from 'blessed'
import { screen, render } from 'global/screen'

export default class Footer {
  private box: blessed.Widgets.BoxElement
  private _content: string = ''

  constructor(parent: blessed.Widgets.BoxElement) {
    this.box = this.createBox(parent)
    screen.append(this.box)
  }
  createBox(parent: blessed.Widgets.BoxElement) {
    return blessed.box({
      parent,
      bottom: '0',
      left: 'center',
      width: '100%',
      height: 1,
      style: {
        fg: 'white',
        bg: 'black'
      }
    })
  }

  update() {
    this.box.setContent(this._content)
    render()
  }

  set content(content: string) {
    this._content = content
    this.update()
  }

  get element() {
    return this.box
  }
}
