import './commands'
import './stopExec'
import { screen, render } from 'global/screen'
import Controller from './controller'

const controller = new Controller()

screen.append(controller.main)

render()
