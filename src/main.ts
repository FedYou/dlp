import { screen, render, destroy } from 'global/screen'
import { page } from './page'

screen.append(page)

screen.key(['C-c', 'q'], () => {
  destroy()
  process.exit(0)
})

render()
