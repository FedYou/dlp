import blessed, { Widgets } from 'blessed'
import { render } from 'global/screen'

const SPINNERS = {
  loading: ['>', '>>', '>>>', ''],
  downloading: ['▇▃▅', '▃▃▇', '▅▇▃', '▁▇▃', '▅▄▆', '▄▇▅'],
  processing: [' ⠋', ' ⠙', ' ⠹', ' ⠸', ' ⠼', ' ⠴', ' ⠦', ' ⠧', ' ⠇', ' ⠏']
}

export default class Status {
  element: Widgets.BoxElement
  private frames: number = 0
  private interval: any

  constructor() {
    this.element = blessed.box({
      width: '0%+5',
      height: '0%+3',
      border: 'line'
    })
  }
  private set color(color: 'red' | 'blue' | 'green' | 'cyan' | 'yellow') {
    this.element.style.fg = color
    this.element.style.border.fg = color
  }
  private spinner(type: 'loading' | 'downloading' | 'processing') {
    const spinner = SPINNERS[type]
    this.stopSpinner()
    this.interval = setInterval(() => {
      this.element.setContent(spinner[this.frames % spinner.length])
      render()
      this.frames++
    }, 300)
  }
  private stopSpinner() {
    if (this.interval) clearInterval(this.interval)
    this.frames = 0
  }

  setPosition(top: string, left: string) {
    this.element.top = top
    this.element.left = left
    render()
  }

  type(type: 'loading' | 'success' | 'error' | 'downloading' | 'processing' | 'any') {
    this.stopSpinner()

    if (type === 'loading') {
      this.color = 'blue'
      this.spinner('loading')
      return
    } else if (type === 'downloading') {
      this.color = 'cyan'
      this.spinner('downloading')
      return
    } else if (type === 'processing') {
      this.color = 'yellow'
      this.spinner('processing')
      return
    }

    if (type === 'success') {
      this.color = 'green'
      this.element.setContent(' ✔')
    } else if (type === 'error') {
      this.color = 'red'
      this.element.setContent(' ✖')
    } else if (type === 'any') {
      this.color = 'yellow'
      this.element.setContent('---')
    }
    render()
  }
}
