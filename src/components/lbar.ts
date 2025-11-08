const charsComplete = '█'
const charsIncomplete = '░'

function bar(width: number, progress: number) {
  width = width - 4 - progress.toString().length
  const complete = Math.floor((progress / 100) * width)
  const barIncomplete = charsIncomplete.repeat(width - complete)
  const barComplete = charsComplete.repeat(complete)
  return `${progress}%[${barComplete}${barIncomplete}]`
}
export default bar
