import blessed from 'blessed'
import { screen, render } from './global/screen'

enum LABEL {
  INPUT_URL_TOP = 'URL',
  INPUT_URL_BOTTOM = '[x] Insert URL - [d] Start download',
  INPUT_URL_MESSAGE = 'Insert a valid URL',
  INPUT_URL_INVALID = 'Invalid URL',
  INPUT_URL_VALID_YT = 'Valid URL - Youtube',
  INPUT_URL_VALID_IG = 'Valid URL - Instagram',
  INPUT_URL_VALID_TK = 'Valid URL - TikTok'
}

enum COLOR {
  RED = 'red',
  GREEN = 'green',
  YELLOW = 'yellow',
  BLUE = 'blue',
  MAGENTA = 'magenta',
  CYAN = 'cyan',
  WHITE = 'white',
  BLACK = 'black'
}

const STYLES = {
  INPUT_URL: {
    fg: COLOR.WHITE,
    border: {
      fg: COLOR.YELLOW
    },
    label: {
      fg: COLOR.YELLOW,
      bold: true
    }
  }
}

const page = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '100%',
  height: '100%',
  mouse: true
})

function append(node: blessed.Widgets.Node | blessed.Widgets.Node[]) {
  if (Array.isArray(node)) {
    node.forEach((n) => page.append(n))
  } else {
    page.append(node)
  }
  render()
}

// ---------------------------------------------
// ---------- INPUT URL ------------------------
// ---------------------------------------------

const $URLBox = blessed.textbox({
  parent: page,
  top: '50%',
  left: 'center',
  width: '50%',
  height: 3,
  border: 'line',
  hidden: true,
  label: LABEL.INPUT_URL_TOP,
  style: STYLES.INPUT_URL
})

blessed.text({
  parent: $URLBox,
  top: '50%',
  width: 'shrink',
  height: '5%',
  content: LABEL.INPUT_URL_BOTTOM,
  style: {
    fg: STYLES.INPUT_URL.label.fg
  }
}).left = `50%-${Math.floor(LABEL.INPUT_URL_BOTTOM.length / 1.8)}`

const $URLStatus = blessed.text({
  parent: $URLBox,
  top: '50%+2',
  width: 'shrink',
  height: '5%'
})

// ----------------- Fuctions ------------------

function setURLStatus(message: string, error: boolean = false) {
  $URLStatus.left = `50%-${Math.floor(message.length / 1.7)}`
  $URLStatus.content = message
  $URLStatus.style.fg = error ? COLOR.RED : COLOR.GREEN

  render()
}

function setURLStatusInvalid() {
  setURLStatus(LABEL.INPUT_URL_INVALID, true)
}

function setURLStatusValid(type: 'youtube' | 'instagram' | 'tiktok' | 'message') {
  if (type === 'youtube') {
    setURLStatus(LABEL.INPUT_URL_VALID_YT)
    return
  }
  if (type === 'instagram') {
    setURLStatus(LABEL.INPUT_URL_VALID_IG)
    return
  }
  if (type === 'tiktok') {
    setURLStatus(LABEL.INPUT_URL_VALID_TK)
    return
  }
  setURLStatus(LABEL.INPUT_URL_MESSAGE)
}

function setValueURL(value: string) {
  $URLBox.value = value
  render()
}

function getValueURL() {
  return $URLBox.value
}

function clearValueURL() {
  $URLBox.value = ''
  render()
}

function isVisibleURLBox(visible: boolean) {
  $URLBox.hidden = !visible
  render()
}

export {
  setURLStatusInvalid,
  setURLStatusValid,
  setValueURL,
  getValueURL,
  clearValueURL,
  isVisibleURLBox
}

// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

append([$URLBox])

render()

export { page }
