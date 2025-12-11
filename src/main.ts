import './commands'
import './stopExec'
import blessed from 'blessed'
import { screen, render, destroy } from 'global/screen'
import { Style } from 'utils/baseUi'
import Controller from './controller'

const controller = new Controller()

// Minimo del tamaño de la terminal 78x21

let _continue = false

const sizeWindow = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '100%',
  height: '0%+3',
  tags: true
})

screen.append(sizeWindow)

const width = screen.width as number
const height = screen.height as number

if (width >= 78 && height >= 21) {
  _continue = true
}

if (_continue) {
  screen.remove(sizeWindow)
  screen.append(controller.main)
  render()
}

const lines: string[] = []

lines.push(Style('Minimum screen size 78x21')('center')('bold')('green-fg') + '')
lines.push(Style(`Current screen size ${width}x${height}`)('center')('bold')('red-fg') + '')
lines.push(Style('Press [q] to exit and change terminal size')('center')('bold')('blue-fg') + '')

sizeWindow.content = lines.join('\n')

render()

screen.on('resize', () => {
  const width = screen.width as number
  const height = screen.height as number

  if (width < 78 && height < 21) {
    destroy()
    console.log(`- Minimum screen size 78x21`)
    console.log(`- Current screen size ${width}x${height}`)
    console.log('Size of terminal has been changed; it does not meet minimum requirements')
    process.exit(0)
  }
})
