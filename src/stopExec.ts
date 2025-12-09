import { destroy } from 'global/screen'
process.on('uncaughtException', (err) => {
  destroy()
  console.error(err)
})

process.on('unhandledRejection', (reason) => {
  destroy()
  console.error(reason)
})
