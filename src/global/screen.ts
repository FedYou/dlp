import blessed from 'blessed'

const TITLE = 'DLP TUI'

const screen: blessed.Widgets.Screen = blessed.screen({
  smartCSR: true,
  title: TITLE
})

function render() {
  screen.render()
}
function destroy() {
  screen.destroy()
}

function append(element: any) {
  screen.append(element)
}

export { screen, render, destroy, append }
