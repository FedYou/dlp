function getTime(time: number) {
  let minutes = Math.floor(time / 60)
  let seconds = Math.floor(time % 60)
  let hours = 0
  if (minutes <= 60) {
    hours = Math.floor(minutes / 60)
    minutes = minutes % 60
  }

  if (hours === 0) {
    return `${minutes}m${seconds}s`
  }
  return `${hours}h${minutes}m${seconds}s`
}

export default getTime
