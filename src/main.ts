import blessed from 'blessed'
import { screen, render, destroy } from 'global/screen'

import $Footer from 'components/footer'
import $InputURL from 'components/inputURL'
import $Selector from 'components/selector'
import $DLbar from 'components/dlbar'
import $Dialog from 'components/dialog'

const main = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '100%',
  height: '100%'
})

const dialog = new $Dialog(main)
const footer = new $Footer(main)
const inputURL = new $InputURL(main)
const selector = new $Selector(main)
const dlbar = new $DLbar(main)

// Añadir los elementos al main
main.append(dialog.element)
main.append(footer.element)
main.append(inputURL.element)
main.append(selector.element)
main.append(dlbar.element)

// Posicionar los elementos
inputURL.setPosition('50%-2', 'center')
selector.setPosition('center', 'center')
dlbar.setPosition('center', 'center')

// Añadir el contenido al footer
footer.content = '[q | C-c] exit'

screen.key(['C-c', 'q'], () => {
  destroy()
  process.exit(0)
})

screen.append(main)

render()
