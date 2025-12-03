import blessed from 'blessed'
import { screen, render } from './global/screen'

const page = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '100%',
  height: '100%'
})

function append(node: blessed.Widgets.Node | blessed.Widgets.Node[]) {
  if (Array.isArray(node)) {
    node.forEach((n) => page.append(n))
  } else {
    page.append(node)
  }
  render()
}

render()

export { page }
