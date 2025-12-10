import { destroy } from 'global/screen'
process.on('uncaughtException', (err) => {
  destroy()
  console.error(err)
})

process.on('unhandledRejection', (reason) => {
  destroy()
  if ((reason as any).code === 'ECONNREFUSED') {
    console.error('Connect to internet to use DLP')
    return
  }
  console.error(reason)
})
